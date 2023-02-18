using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Client.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime HireDate { get; set; }
        public int Salary { get; set; }
        public virtual Employee Manager { get; set; }
        [ForeignKey("Manager")]
        public int? Manager_Id { get; set; } // foregin key with self reference, the "?" means its nullable
        public virtual Department Department { get; set; }
        [ForeignKey("Department")]
        public int Department_Id { get; set; } // foreign key Department
    }
}
