// src/components/Dashboard.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import SpendOverview from "./SpendOverview";
import SpendHistory from "./SpendHistory";
import ActiveInstances from "./ActiveInstances";
import S3Buckets from "./S3Buckets";
import IdleResources from "./IdleResources";
import SecurityOverview from "./SecurityOverview";
import SecurityTrend from "./SecurityTrend";
import awsLogo from "../assets/aws.png";
import googleLogo from "../assets/google-cloud.png";
import azureLogo from "../assets/azure.jpeg";

const Dashboard = ({ provider }) => {
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8010/metrics");
        setMetrics(response.data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };
    fetchMetrics();

    // Inject keyframes for gradient background animation
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }`;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }, []);

  const getProviderLogo = () => {
    if (provider === "aws") return awsLogo;
    if (provider === "gcp") return googleLogo;
    if (provider === "azure") return azureLogo;
    return null;
  };

  const getProviderName = () => {
    if (provider === "aws") return "AWS Cloud";
    if (provider === "gcp") return "Google Cloud";
    if (provider === "azure") return "Microsoft Azure";
    return "Unknown Provider";
  };

  return (
    <div style={styles.dashboardWrapper}>
      {/* Heading with Logo */}
      <div style={styles.headingContainer}>
        {getProviderLogo() && (
          <img
            src={getProviderLogo()}
            alt="Provider Logo"
            style={styles.logo}
          />
        )}
        <h1 style={styles.heading}>
          Cloud9 Dashboard - {getProviderName()} User
        </h1>

        {/* Navigation Buttons */}
        <div style={styles.buttonGroup}>
          <Button
            style={{
              ...styles.navButton,
              backgroundColor: "#1a036eff",
              color: "#fff",
            }}
            onClick={() => navigate("/security")}
          >
            Security
          </Button>
          <Button
            style={{
              ...styles.navButton,
              backgroundColor: "#1a036eff",
              color: "#fff",
            }}
            onClick={() => navigate("/budget")}
          >
            Budget
          </Button>
          <Button
            style={{
              ...styles.navButton,
              backgroundColor: "#1a036eff",
              color: "#fff",
            }}
            onClick={() => navigate("/optimizer")}
          >
            Optimizer
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {metrics && (
        <Row style={styles.summaryRow}>
          <Col md={4}>
            <Card style={styles.summaryCard}>
              <Card.Body>
                <Card.Title>Total Spend</Card.Title>
                <Card.Text style={styles.metricText}>
                  ₹ {metrics.totalSpend}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={styles.summaryCard}>
              <Card.Body>
                <Card.Title>Idle Resources</Card.Title>
                <Card.Text style={styles.metricText}>
                  {metrics.idleResources}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={styles.summaryCard}>
              <Card.Body>
                <Card.Title>Predicted Savings</Card.Title>
                <Card.Text style={styles.metricText}>
                  ₹ {metrics.predictedSavings}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Organized Grid: 2 by 2 sections */}
      <Row style={styles.sectionRow}>
        <Col md={6}>
          <div style={styles.gridItem}>
            <SpendOverview />
          </div>
        </Col>
        <Col md={6}>
          <div style={styles.gridItem}>
            <SpendHistory />
          </div>
        </Col>
      </Row>

      <Row style={styles.sectionRow}>
        <Col md={6}>
          <div style={styles.gridItem}>
            <ActiveInstances provider={provider} />
          </div>
        </Col>
        <Col md={6}>
          <div style={styles.gridItem}>
            <S3Buckets provider={provider} />
          </div>
        </Col>
      </Row>

      <Row style={styles.sectionRow}>
        <Col md={6}>
          <div style={styles.gridItem}>
            <IdleResources />
          </div>
        </Col>
        <Col md={6}>
          <div style={styles.gridItem}>
            <SecurityOverview />
          </div>
        </Col>
      </Row>

      {/* Full Width for Trend */}
      <Row style={styles.sectionRow}>
        <Col md={12}>
          <div style={styles.gridItem}>
            <SecurityTrend />
          </div>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  dashboardWrapper: {
    textAlign: "center",
    minHeight: "100vh",
    padding: "30px 20px",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(-45deg, #1e3c72, #2a5298, #00c6ff, #0072ff)",
    backgroundSize: "400% 400%",
    animation: "gradientAnimation 15s ease infinite",
  },
  headingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#fff",
    marginTop: "10px",
  },
  logo: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
  },
  buttonGroup: {
    marginTop: "20px",
    display: "flex",
    gap: "15px",
  },
  navButton: {
    padding: "8px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
  },

  summaryRow: {
    marginBottom: "30px",
  },
  sectionRow: {
    marginBottom: "30px",
  },
  summaryCard: {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    marginBottom: "15px",
    textAlign: "center",
  },
  metricText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#007bff",
  },
  gridItem: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
};

export default Dashboard;
