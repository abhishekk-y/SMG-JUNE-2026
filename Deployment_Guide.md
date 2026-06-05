# SMG Portal - Free Tier Deployment Guide

To bring your MERN stack application online completely for free, we will split the deployment into three parts using the best free-tier platforms available in 2026:

1.  **Database:** MongoDB Atlas (Free M0 Cluster)
2.  **Backend:** Render.com (Free Web Service)
3.  **Frontend:** Vercel (Free Hobby Tier)

---

## Step 1: Deploy the Database (MongoDB Atlas)
Currently, your app uses a local database (`mongodb://127.0.0.1:27017`). We need a cloud database.

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2.  Create a new cluster and select the **M0 Free** tier.
3.  Under **Security -> Database Access**, create a new database user (e.g., `smg_admin`) and give it a strong password. **Save this password**.
4.  Under **Security -> Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`).
5.  Click **Connect** on your cluster, select **Connect your application**, and copy the connection string.
    *   It will look like this: `mongodb+srv://smg_admin:<password>@cluster0.abcde.mongodb.net/employee-portal?retryWrites=true&w=majority`
    *   *Keep this URI safe, we will use it in Step 2.*

---

## Step 2: Deploy the Backend (Render.com)
Render is the best free alternative to Heroku for hosting Node.js APIs.

1.  Create a free account on [Render.com](https://render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select your repository (`abhishekk-y/SMG-JUNE-2026`).
4.  Configure the service:
    *   **Name:** `smg-backend-api`
    *   **Root Directory:** `backend` (This is very important!)
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
    *   **Instance Type:** Free
5.  Scroll down to **Environment Variables** and add all the keys from your backend `.env` file:
    *   `PORT` = `10000` (Render defaults to 10000)
    *   `MONGO_URI` = *(Paste the Atlas URI from Step 1, replacing `<password>` with your real password)*
    *   `JWT_SECRET` = `smg-employee-portal-secret-2024` (or generate a stronger one)
    *   `SMTP_HOST` = `smtp.gmail.com`
    *   `SMTP_PORT` = `587`
    *   `SMTP_SECURE` = `false`
    *   `SMTP_USER` = `smgemployeeportal@gmail.com`
    *   `SMTP_PASS` = *(Your 16-character Google App Password)*
6.  Click **Create Web Service**. 
    *   Render will now build and deploy your API. Once finished, copy the provided URL (e.g., `https://smg-backend-api.onrender.com`).

---

## Step 3: Connect Frontend to the Cloud API
Before deploying the frontend, it needs to know where the new cloud backend is located.

1.  In your code, go to `frontend/src/services/api.ts` (or wherever your base URL is defined).
2.  Change the base API URL from localhost to the Render URL you just copied:
    ```javascript
    // Before:
    // const BASE_URL = 'http://localhost:5000/api';
    
    // After:
    const BASE_URL = 'https://smg-backend-api.onrender.com/api';
    ```
3.  Commit this change and push it to GitHub:
    ```bash
    git add frontend/
    git commit -m "chore: update api url for production"
    git push origin main
    ```

---

## Step 4: Deploy the Frontend (Vercel)
Vercel is optimized specifically for React/Vite applications and provides a lightning-fast free tier.

1.  Create a free account on [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository (`abhishekk-y/SMG-JUNE-2026`).
4.  In the configuration screen, make sure to set the **Framework Preset** to **Vite**.
5.  Set the **Root Directory** to `frontend`.
6.  Click **Deploy**.
7.  Vercel will build your React app. Once done, you will receive a public `.vercel.app` URL!

---

### Final Verification
*   Visit your new Vercel link.
*   Log in as Super Admin (`superadmin@smg.com` / `admin123`).
*   The dashboard should load perfectly, drawing live data from MongoDB Atlas via your Render backend.

*(Note: Render's free tier "spins down" after 15 minutes of inactivity. When you visit the app after a break, the very first API request might take 30-50 seconds while the backend wakes up. This is normal for free hosting!)*
