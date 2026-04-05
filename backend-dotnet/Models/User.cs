using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
	public class User : IdentityUser
	{
		[Required]
		[MaxLength(255)]
		public string FullName { get; set; } = string.Empty;

		public ICollection<Notebook> NotebooksNav { get; set; } = new List<Notebook>();
	}
}
