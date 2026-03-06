
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from scipy import stats
import pandas as pd

app = FastAPI(title="CRUSHOME ML Core")

class ForecastRequest(BaseModel):
    historical_prices: list[float]
    time_steps: int = 6

class MonteCarloRequest(BaseModel):
    cost: float
    expected_revenue: float
    absorption_months: int
    iterations: int = 5000

@app.get("/health")
def health():
    return {"status": "online", "engine": "Bayesian-MonteCarlo-v2"}

@app.post("/predict/trend")
async def predict_trend(data: ForecastRequest):
    """
    Inferencia Bayesiana para Proyección de Precios.
    """
    if len(data.historical_prices) < 3:
        return {"trend": "neutral", "confidence": 0.5}
    
    # Simulación de regresión para momentum
    y = np.array(data.historical_prices)
    x = np.arange(len(y))
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
    
    direction = "bullish" if slope > 0.02 else "bearish" if slope < -0.02 else "stable"
    
    # Proyección a futuro
    future_x = np.arange(len(y), len(y) + data.time_steps)
    projections = (slope * future_x + intercept).tolist()
    
    return {
        "direction": direction,
        "slope": float(slope),
        "confidence": float(abs(r_value)),
        "projections": projections,
        "error_margin": float(std_err)
    }

@app.post("/predict/roi-risk")
async def predict_roi(data: MonteCarloRequest):
    """
    Simulación Monte Carlo para ROI ajustado por riesgo en desarrollos.
    """
    # Variables estocásticas (Incertidumbre en costo, revenue y tiempo)
    costs = np.random.normal(data.cost, data.cost * 0.07, data.iterations)
    revenues = np.random.normal(data.expected_revenue, data.expected_revenue * 0.12, data.iterations)
    times = np.random.poisson(data.absorption_months, data.iterations)
    
    # Cálculo de ROI
    roi_results = (revenues - costs) / costs
    annualized_roi = roi_results / (times / 12)
    
    return {
        "mean_roi": float(np.mean(roi_results)),
        "p50_roi": float(np.median(roi_results)),
        "p90_roi": float(np.percentile(roi_results, 90)),
        "prob_of_loss": float(np.sum(roi_results < 0) / data.iterations),
        "annualized_roi_avg": float(np.mean(annualized_roi)),
        "value_at_risk_95": float(np.percentile(roi_results, 5))
    }
