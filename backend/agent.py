import os
from typing import Literal, List, Optional, Dict
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

class AlphaGridAction(BaseModel):
    action: Literal["SHUTDOWN", "STANDBY"]
    target_substations: List[str]
    reason: str

class BetaMedEvacAction(BaseModel):
    action: Literal["EVACUATE", "SHELTER_IN_PLACE"]
    at_risk_hospitals: List[str]
    inland_safe_zone: str
    evacuation_route: str

class GammaFinanceAction(BaseModel):
    action: Literal["LIQUIDITY_RELEASED", "MONITORING"]
    amount_authorized: str
    recipient: str

class FinancialBudget(BaseModel):
    survival_budget_allocation: str
    micro_insurance_payout_triggered: bool

class CrowCitizenSchema(BaseModel):
    system_status: Literal["WARNING - STORM BREWING", "CRITICAL - PRE-LANDFALL INITIATED"]
    vulnerability_score: float
    telemetry_summary: Dict[str, float]
    evacuation_plan: Optional[str] = Field(None, description="Dynamic turn-by-turn route avoiding flood zones (CRITICAL state)")
    financial_budget: Optional[FinancialBudget] = None
    home_hardening_tasks: List[str] = Field(..., description="Tasks to secure property")
    action_alpha_grid: Optional[AlphaGridAction] = None
    action_beta_medevac: Optional[BetaMedEvacAction] = None
    action_gamma_finance: Optional[GammaFinanceAction] = None
    system_degraded: bool = False

def run_citizen_agent(telemetry: dict, elevation: float, vulnerability: float, bank_balance: float, degraded_flag: bool) -> dict:
    """
    Orchestrates the Gemini 1.5 agent to generate the citizen response payload.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return _fallback_schema(telemetry, vulnerability, True)

    client = genai.Client(api_key=api_key)

    rag_context = """
    CITIZEN DISASTER RESILIENCE RULES - VISAKHAPATNAM MUNICIPALITY:
    - Evacuation Route: From coastal areas, use NH-16 towards inland safe zones. Avoid Beach Road and low-lying areas like Gajuwaka which are flood prone.
    - Safety Tasks: Secure loose outdoor items, board windows, move valuables to higher floors.
    - Financial: Micro-insurance payout is triggered if storm severity is critical (wind > 110 km/h) AND user bank balance < $100.
    """

    multi_tier_rules = """
    MULTI-TIERED ESCALATION PROTOCOL:
    - If wind speeds are BELOW 100 km/h: Set system_status to 'WARNING - STORM BREWING'. Output basic preparatory advice (home_hardening_tasks). Do NOT output full evacuation_plan, financial_budget, or Tri-Agent actions (Alpha/Beta/Gamma).
    - If wind speeds EXCEED 110 km/h: Set system_status to 'CRITICAL - PRE-LANDFALL INITIATED'. Fully execute Tri-Agent protocols: Alpha (Grid Shutdown), Beta (Med-Evac), Gamma (Parametric Fund Release). Provide a full evacuation_plan and financial_budget.
    """

    prompt = f"""
    You are the Overseer Agent for Project CROW, an autonomous civil defense system.
    
    Current Telemetry:
    - Wind Speed: {telemetry.get('wind_speed_kmh')} km/h
    - Surface Pressure: {telemetry.get('surface_pressure_hpa')} hPa
    - Elevation: {elevation} m
    - Vulnerability Score: {vulnerability}
    - Citizen Bank Balance: ${bank_balance}

    {rag_context}
    
    {multi_tier_rules}
    
    Analyze the current telemetry and citizen state to output the strictly structured JSON response.
    """

    try:
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CrowCitizenSchema,
                temperature=0.2,
            ),
        )
        # Parse the JSON response
        import json
        result = json.loads(response.text)
        result['system_degraded'] = degraded_flag
        return result
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return _fallback_schema(telemetry, vulnerability, True)


def _fallback_schema(telemetry: dict, vulnerability: float, system_degraded: bool) -> dict:
    wind = telemetry.get('wind_speed_kmh', 0)
    status = "CRITICAL - PRE-LANDFALL INITIATED" if wind > 110 else "WARNING - STORM BREWING"
    
    res = {
        "system_status": status,
        "vulnerability_score": vulnerability,
        "telemetry_summary": telemetry,
        "home_hardening_tasks": ["Secure loose outdoor items", "Board windows", "Move valuables upstairs"],
        "system_degraded": system_degraded
    }
    
    if status == "CRITICAL - PRE-LANDFALL INITIATED":
        res.update({
            "evacuation_plan": "Evacuate via NH-16 towards inland safe zone.",
            "financial_budget": {
                "survival_budget_allocation": "$50 for essentials",
                "micro_insurance_payout_triggered": True
            },
            "action_alpha_grid": {
                "action": "SHUTDOWN",
                "target_substations": ["Gajuwaka 400kV"],
                "reason": "Prevent flood electrocution"
            },
            "action_beta_medevac": {
                "action": "EVACUATE",
                "at_risk_hospitals": ["King George Hospital"],
                "inland_safe_zone": "Anakapalle",
                "evacuation_route": "NH-16"
            },
            "action_gamma_finance": {
                "action": "LIQUIDITY_RELEASED",
                "amount_authorized": "$5,000,000",
                "recipient": "Municipal Emergency Fund"
            }
        })
        
    return res
