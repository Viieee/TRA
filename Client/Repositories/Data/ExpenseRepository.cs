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
    public class ExpenseRepository : GeneralRepository<Expense>
    {
        private readonly string address;
        private readonly HttpClient httpClient;
        private readonly IHttpContextAccessor _contextAccessor;
        public ExpenseRepository(string request = "Expense/") : base(request)
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

        public List<Expense> GetAllByParentId(int id)
        {
            List<Expense> expenses = new List<Expense>();
            var responseTask = httpClient.GetAsync($"Expense/getAllByParent/{id}");
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var resultJsonString = result.Content.ReadAsStringAsync();
                resultJsonString.Wait();
                JObject rss = JObject.Parse(resultJsonString.Result);
                JArray data = (JArray)rss["data"];
                expenses = JsonConvert.DeserializeObject<List<Expense>>((JsonConvert.SerializeObject(data)));
            }
            return expenses;
        }
    }
}
