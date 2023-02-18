using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Client.Models
{
    public class Expense
    {
        [Key]
        public int Id { get; set; }
        //[Required]
        public string TypeOfExpense { get; set; }
        public string Description { get; set; }
        public int Budget { get; set; }
        public virtual Request Request { get; set; }
        [ForeignKey("Request")]
        public int Request_Id { get; set; }
    }
}
