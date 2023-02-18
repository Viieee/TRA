using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Request
    {
        [Key]
        public int Id { get; set; }
        public string TravelPurpose { get; set; }
        public string Destination { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int TotalBudget { get; set; }
        public string Status { get; set; }
        public string AttachmentFileUrl { get; set; }
        public virtual Employee Employee { get; set; }
        [ForeignKey("Employee")]
        public int Employee_Id { get; set; } // foreign key Employee
    }
}
