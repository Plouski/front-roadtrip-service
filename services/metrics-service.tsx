import axios from "axios";

export class MetricsService {

    static async getMetrics() {
      const response = await axios.get("http://localhost:9090/api/v1/query_range", {
        params: {
          query: 'http_requests_total',
          start: (Date.now() / 1000) - 300,  // il y a 5 minutes
          end: Date.now() / 1000,             // maintenant
          step: 15,                           // toutes les 15 secondes
        },
      });
  
      return response.data.data.result;
    }

}

// import axios from "axios";

// const API_GATEWAY_URL = process.env.NEXT_PUBLIC_METRICS_SERVICE_URL || "http://localhost:5006";

// export class MetricsService {
//   static async getMetrics() {
//     const end = Math.floor(Date.now() / 1000);
//     const start = end - 300;
//     const step = 15;

//     const response = await axios.get(`${API_GATEWAY_URL}/metrics`, {
//       params: { start, end, step },
//     });

//     return response.data;
//   }
// }

