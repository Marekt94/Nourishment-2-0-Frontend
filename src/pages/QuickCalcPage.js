/**
 * QuickCalcPage Component
 * Page wrapper for the Quick Meal Calculator
 */

import React from "react";
import { QuickCalc } from "../components/features/quickCalc/QuickCalc";
import "./QuickCalcPage.css";

export const QuickCalcPage = () => {
  return (
    <div className="quick-calc-page">
      <div className="quick-calc-page__header">
        <h1 className="quick-calc-page__title">🧮 Kalkulator</h1>
      </div>

      <div className="quick-calc-page__container">
        <QuickCalc />
      </div>
    </div>
  );
};
