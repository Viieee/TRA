using Client.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

namespace Client.Repositories
{
    public class GeneralRepository<Entity> : IGeneralRepository<Entity>
        where Entity : class
    {
        private readonly string address;
        private readonly string request;
        private readonly HttpClient httpClient;
        private readonly IHttpContextAccessor _contextAccessor;

        public GeneralRepository(string request)
        {
            this.address = "https://localhost:44393/api/";
            this.request = request;
            _contextAccessor = new HttpContextAccessor();
            var test = _contextAccessor.HttpContext.Session.GetString("token"); // testing to see if the token exist
            httpClient = new HttpClient
            {
                BaseAddress = new Uri(address) // setting the base address of the api
            };
            // sticking the token into the request's header (for API)
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _contextAccessor.HttpContext.Session.GetString("token"));
        }

        // implements all the methods inside the interface
        // get all data
        public List<Entity> Get()
        {
            List<Entity> entities = new List<Entity>();
            var responseTask = httpClient.GetAsync(request);
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var resultJsonString = result.Content.ReadAsStringAsync();
                resultJsonString.Wait();
                JObject rss = JObject.Parse(resultJsonString.Result);
                JArray data = (JArray)rss["data"];
                entities = JsonConvert.DeserializeObject<List<Entity>>((JsonConvert.SerializeObject(data)));
            }
            return entities;
        }

        // get by id
        public Entity Get(int id)
        {
            Entity entity = null;
            var responseTask = httpClient.GetAsync($"{request}{id.ToString()}");
            responseTask.Wait();

            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                // if successful, get the response 
                var resultJson = result.Content.ReadAsStringAsync();
                resultJson.Wait();
                // parsing the json
                JObject objectResult = JObject.Parse(resultJson.Result);
                JObject data = (JObject)objectResult["data"];
                // converting json into .net type (in this case its the entity's type)
                entity = JsonConvert.DeserializeObject<Entity>(JsonConvert.SerializeObject(data));
            }
            return entity;
        }

        // post 
        public object Post(Entity entity)
        {
            StringContent content = new StringContent(JsonConvert.SerializeObject(entity), Encoding.UTF8, "application/json");
            var result = httpClient.PostAsync(request, content).Result;
            object returnValue;
            if (result.IsSuccessStatusCode)
            {
                // if successful, get the response 
                var resultJson = result.Content.ReadAsStringAsync();
                resultJson.Wait();
                // parsing the json
                JObject objectResult = JObject.Parse(resultJson.Result);
                JValue statusCode = (JValue)objectResult["status"]; // status
                JObject data = (JObject)objectResult["data"]; // the data
                // converting json into .net type (in this case its the entity's type)
                var statusCodeParsed = JsonConvert.DeserializeObject<HttpStatusCode>(JsonConvert.SerializeObject(statusCode));
                var entityParsed = JsonConvert.DeserializeObject<Entity>(JsonConvert.SerializeObject(data));
                returnValue = new { result = statusCodeParsed, entity = entityParsed };
                return returnValue;
            }
            returnValue = new { result = 401, entity = "" };
            return returnValue;
        }

        // edit
        public object Put(int id, Entity entity)
        {
            StringContent content = new StringContent(JsonConvert.SerializeObject(entity), Encoding.UTF8, "application/json");
            var result = httpClient.PutAsync(request + id, content).Result;
            object returnValue;
            if (result.IsSuccessStatusCode)
            {
                // if successful, get the response 
                var resultJson = result.Content.ReadAsStringAsync();
                resultJson.Wait();
                // parsing the json
                JObject objectResult = JObject.Parse(resultJson.Result);
                JValue statusCode = (JValue)objectResult["status"]; // status
                JObject data = (JObject)objectResult["data"]; // the data
                // converting json into .net type (in this case its the entity's type)
                var statusCodeParsed = JsonConvert.DeserializeObject<HttpStatusCode>(JsonConvert.SerializeObject(statusCode));
                var entityParsed = JsonConvert.DeserializeObject<Entity>(JsonConvert.SerializeObject(data));
                returnValue = new { result = statusCodeParsed, entity = entityParsed };
                return returnValue;
            }
            returnValue = new { result = 401, entity = "" };
            return returnValue;
        }

        // delete
        public HttpStatusCode Delete(int id)
        {
            var result = httpClient.DeleteAsync(request + id).Result;
            return result.StatusCode;
        }
    }
}
