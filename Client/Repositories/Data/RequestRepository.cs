using Client.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Client.Repositories.Data
{
    public class RequestRepository : GeneralRepository<Request>
    {
        private readonly string address;
        private readonly HttpClient httpClient;
        private readonly IHttpContextAccessor _contextAccessor;
        public RequestRepository(string request = "Request/") : base(request)
        {
            _contextAccessor = new HttpContextAccessor();
            address = "https://localhost:44393/api/";
            httpClient = new HttpClient
            {
                BaseAddress = new Uri(address) // setting the base address of the api
            };
            // sticking the token into the request's header (for API)
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _contextAccessor.HttpContext.Session.GetString("token"));
        }
        // get all request of current logged in user
        public List<Request> GetAllByEmployee(int id)
        {
            List<Request> entities = new List<Request>();
            var responseTask = httpClient.GetAsync("Request/getAllByEmployee/" + id);
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var resultJsonString = result.Content.ReadAsStringAsync();
                resultJsonString.Wait();
                JObject rss = JObject.Parse(resultJsonString.Result);
                JArray data = (JArray)rss["data"];
                entities = JsonConvert.DeserializeObject<List<Request>>((JsonConvert.SerializeObject(data)));
            }
            return entities;
        }

        // getting all request for finance role
        public List<Request> GetAllFinance()
        {
            List<Request> entities = new List<Request>();
            var responseTask = httpClient.GetAsync("Request/getAllFinance/");
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var resultJsonString = result.Content.ReadAsStringAsync();
                resultJsonString.Wait();
                JObject rss = JObject.Parse(resultJsonString.Result);
                JArray data = (JArray)rss["data"];
                entities = JsonConvert.DeserializeObject<List<Request>>((JsonConvert.SerializeObject(data)));
            }
            return entities;
        }

        // getting all request for manager role
        public List<Request> GetAllManager(int id)
        {
            List<Request> entities = new List<Request>();
            var responseTask = httpClient.GetAsync("Request/getAllManager/" + id);
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var resultJsonString = result.Content.ReadAsStringAsync();
                resultJsonString.Wait();
                JObject rss = JObject.Parse(resultJsonString.Result);
                JArray data = (JArray)rss["data"];
                entities = JsonConvert.DeserializeObject<List<Request>>((JsonConvert.SerializeObject(data)));
            }
            return entities;
        }
    }
}
