using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers
{
	[ApiController]
	[Route("/api[controller]")]
	public abstract class BaseApiController : ControllerBase
	{
		protected string UserId
		{
			get
			{
				var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
				if (string.IsNullOrEmpty(userId))
				{
					throw new UnauthorizedAccessException("Unable to find user id in token!");
				}
				return userId;
			}
		}
	}
}
