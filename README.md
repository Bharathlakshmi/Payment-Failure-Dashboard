**Payment Failure Dashboard**

Payment Failure Dashboard is a real-time analytics system designed to track, analyze, and visualize failed digital payment transactions. It helps teams quickly understand why transactions fail and identify patterns across multiple dimensions such as payment gateways, bank networks, and transaction channels.

The project includes **Razorpay payment gateway integration** to simulate and analyze real-world digital payment scenarios. Razorpay acts as the primary payment processor, enabling the system to capture real-time payment statuses, failure responses, and error codes. This integration helps identify failure reasons such as network issues, bank declines, timeout errors, and gateway-related problems, which are logged and visualized in the dashboard for effective root-cause analysis.

This dashboard is highly practical for monitoring Razorpay transaction reliability, improving payment success rates, and evaluating gateway-level performance.

**Purpose**
The primary goal of this project is to provide actionable insights into failed payment transactions by ingesting transaction logs, analyzing failure reasons, and visualizing trends. It is ideal for monitoring reliability issues in digital payment systems.

**User Interfaces**
**User Dashboard**\n
Allows users to initiate payments
Displays transaction history with success and failure statuses

**Staff / Analytics Dashboard**
Provides interactive charts and dashboards
Displays failure trends and detailed operational metrics for analysis teams

**Core Functionalities**
Real-time payment failure logging and analytics
Filtering and visualization by payment gateway, bank, channel, and time range
Simulation tools for testing network and system failures
Transaction history tracking and pattern analysis
Role-based access control for users and staff

**Technology Stack**
**Frontend**: React, TypeScript, Material-UI
**Backend:** ASP.NET Core with RESTful APIs
**Database:** SQL Server
**Authentication:** JWT-based authentication
**API Documentation:** Swagger

