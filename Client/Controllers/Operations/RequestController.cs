using Client.Controllers.Base;
using Client.Repositories.Data;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

namespace Client.Controllers.Request
{
    [Authorize]
    public class RequestController : BaseController<Models.Request, RequestRepository>
    {
        RequestRepository repository;
        public RequestController(RequestRepository repository): base(repository)
        {
            this.repository = repository;
        }
        public IActionResult Index()
        {
            return View("Employee");
        }
        public IActionResult Manager()
        {
            return View("Manager");
        }
        public IActionResult Finance()
        {
            return View("Finance");
        }
        [HttpGet]
        public JsonResult GetAllByEmployee(int id)
        {
            var result = repository.GetAllByEmployee(id);
            return Json(result);
        }
        [HttpGet]
        public JsonResult GetAllFinance()
        {
            var result = repository.GetAllFinance();
            return Json(result);
        }
        [HttpGet]
        public JsonResult GetAllManager(int id)
        {
            var result = repository.GetAllManager(id);
            return Json(result);
        }

        [HttpPost] // /Request/SendEmail
        public JsonResult SendEmail(Models.Request request)
        {
            MimeMessage message = new MimeMessage();
            MailboxAddress from = new MailboxAddress("K1TRA", "trappgg@outlook.com");
            MailboxAddress to = new MailboxAddress($"{request.Employee.FirstName}{request.Employee.LastName}", $"{request.Employee.Email}");

            message.From.Add(from);
            message.To.Add(to);

            message.Subject = "Travel Request Approval Status";
            BodyBuilder bodyBuilder = new BodyBuilder();
            if (request.Status != "Approved")
            {
                bodyBuilder.HtmlBody = $"<h1>Your travel request has been rejected</h1>";
                bodyBuilder.TextBody = "Your travel reqeust has been rejected";
            }
            else
            {
                bodyBuilder.HtmlBody = $"<h1>Your travel request has been approved, please download the documents in the app</h1>";
                bodyBuilder.TextBody = "Your travel reqeust has been approved";
            }
            message.Body = bodyBuilder.ToMessageBody();

            SmtpClient client = new SmtpClient();
            client.Connect("smtp-mail.outlook.com", 587, SecureSocketOptions.StartTls);
            client.Authenticate("trappgg@outlook.com", "Kenway99.");

            client.Send(message);
            client.Disconnect(true);
            client.Dispose();
            return Json("t");
        }
    }
}
