using Client.Models.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;

namespace Client.Controllers.Auth
{
    public class AuthController : Controller
    {
        IHttpContextAccessor HttpContextAccessor = new HttpContextAccessor();
        public IActionResult Index()
        {
            if (HttpContextAccessor.HttpContext.Session.GetString("token") != null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View("Login");
        }

        // login operation
        [Route("Login")]
        [HttpPost]
        public IActionResult Login(Login input)
        {
            string token = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://localhost:44393/api/");
                var postTask = client.PostAsJsonAsync<Login>("Auth/Login", input);
                postTask.Wait();
                var result = postTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var resultJsonString = result.Content.ReadAsStringAsync();
                    resultJsonString.Wait();
                    JObject rss = JObject.Parse(resultJsonString.Result);
                    JValue tokenObject = (JValue)rss["token"];
                    token = tokenObject.ToString();
                    HttpContext.Session.SetString("token", token);
                    return RedirectToAction("Index", "Home");
                }
            }
            // jika login gagal
            ViewBag.Message = "Gagal";
            return View("Login");
        }

        // logout operation
        [Route("Logout")]
        [HttpGet]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("token");
            return RedirectToAction("Index", "Auth");
        }
    }
}
