# 🌾 Agri Food Platform – End-to-End DevOps & Observability Project

This repository demonstrates a **production-ready DevOps pipeline** with full CI/CD automation, GitOps deployment, and a complete observability stack running on Kubernetes.

The project covers the **entire lifecycle**:  
source code → Docker image → CI pipeline → GitOps deployment → monitoring & logging.

---

## 🏗️ System Architecture
![Uploading image.png…]()

![System Overview](docs/images/argocd-app.png)

### Technologies Used

- **Application:** Node.js (REST API with `/metrics`)
- **Containerization:** Docker
- **CI:** GitHub Actions
- **CD / GitOps:** Argo CD
- **Orchestration:** Kubernetes (Docker Desktop / Minikube)
- **Monitoring:** Prometheus & Grafana
- **Logging:** Grafana Loki
- **Metrics Scraping:** Prometheus Operator + ServiceMonitor

---

## 🔄 1. Continuous Integration (CI)

![GitHub Actions](docs/images/ci-github-actions.png)

CI is fully automated using **GitHub Actions**.

### What happens on every push to `main`:

1. Source code is checked out
2. Docker image is built
3. Image is pushed to Docker Hub
4. Image tag is updated automatically in Helm `values.yaml`
5. Changes are committed back to the repository

📦 **Docker image repository:**

 
![Docker Hub Image](docs/images/dockerhub-image.png)

---

## ☸️ 2. GitOps Continuous Deployment (CD)

![ArgoCD Application](docs/images/argocd-app.png)

Deployment is handled using **GitOps principles** with Argo CD.

### Key points:

- Git repository is the **single source of truth**
- Argo CD continuously watches the Helm chart
- Any Git change is **automatically synchronized** to the cluster
- Full deployment history & rollback support

📍 **Namespace:** `apps`  
📍 **Chart path:** `helm/agri-food-api`

---

## 📊 3. Monitoring with Prometheus & Grafana

### 🔍 Prometheus Targets

![Prometheus Targets](docs/images/prometheus-targets.png)

- Application metrics are exposed via `/metrics`
- Prometheus scrapes metrics using `ServiceMonitor`
- Targets are healthy and actively scraped

---

### 📈 Grafana Dashboards

![Grafana Dashboard](docs/images/grafana-dashboard.png)

Dashboards provide real-time insights into:

- CPU usage
- Memory consumption
- Request rate
- Pod-level metrics
- Cluster health

---

## 🧾 4. Centralized Logging with Loki

![Grafana Logs](docs/images/grafana-logs.png)

- Logs from application pods are collected via Promtail
- Stored and queried using Grafana Loki
- Enables fast debugging and log correlation with metrics

---

## 📂 Project Structure

```text
monitoring-project/
├── .github/
│   └── workflows/
│       └── ci-build-push.yml        # CI pipeline (build, push, update Helm)
├── docs/
│   └── images/                      # README screenshots
├── helm/
│   └── agri-food-api/               # Helm chart
│       ├── templates/
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── servicemonitor.yaml
│       └── values.yaml
├── src/
│   └── index.js                     # Application source code
├── Dockerfile
├── package.json
├── kube-prometheus-stack-values.yaml
└── node-exporter-values.yaml
