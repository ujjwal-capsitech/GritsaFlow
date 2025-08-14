using GritsaFlow;
using GritsaFlow.DTOs;
using GritsaFlow.Models;
using GritsaFlow.Server.Models;
using GritsaFlow.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserServices _service;
    private readonly IConfiguration _config;
    private readonly TokenService _tokenService;

    public UserController(UserServices service, IConfiguration config, TokenService tokenService)
    {
        _service = service;
        _config = config;
        _tokenService = tokenService;

    }

    [HttpPost("register")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Register(RegisterDTO dto )
    {
        var result = await _service.RegisterAsync(dto);
        return Ok(ApiResponse<UserDTO>.Ok(result));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var user = await _service.AuthenticateAsync(dto.UserName, dto.Password);
        if (user == null) return Unauthorized("Invalid credentials");

        var (accessToken, refreshToken, refreshExpiry) = _tokenService.GenerateTokens(user);

        await _service.StoreRefreshTokenAsync(user.UserId, refreshToken, refreshExpiry);

        SetAuthCookies(accessToken, refreshToken, refreshExpiry);
        var employee = new UserDTO
        {
            UserId = user.UserId,
            Name = user.Name,
            Role = user.Role,
            Email = user.Email,
            UserName = user.UserName,
            AvatarUrl = user.AvatarUrl,
        };  

        var response = new
        {
            message = "Login SuccessFul",
            newUser = employee,
            TokenExpiry = refreshExpiry,
        };

        return Ok(response);
    }
    [HttpGet("role")]
    public async Task<IActionResult> role()
    {
        var userIdclaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdclaim == null) return Unauthorized("Invalid Token");
        var userId = userIdclaim.Value;
        var user = await _service.GetByidAsync(userId);
        if (user == null) return NotFound(new { message = "user not Found" });
        return Ok(new
        {
            role = user.Role
        });
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _service.DeleteRefreshTokenAsync(refreshToken);
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
        }

        return Ok(ApiResponse<string>.Ok("Logged out successfully"));
    }

    [HttpGet("session")]
    public IActionResult CheckSession()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken)) return Unauthorized();

        var isValid = _tokenService.ValidateRefreshToken(refreshToken);
        if (!isValid) return Unauthorized();

        return Ok(new { message = "Session valid" });
    }
    [HttpGet("basic")]
    public async Task<ActionResult<ApiResponse<PagedResult<UserBasicDto>>>> GetAllBasic(int pageNumber = 1, int pageSize = 10)
    {
        var users = await _service.GetAllBasicAsync(pageNumber,pageSize);
        return Ok(ApiResponse<PagedResult<UserBasicDto>>.Ok(users));
    }


    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken(string? refreshTokenFromBody)
    {
        var refreshToken = refreshTokenFromBody ?? Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken)) return Unauthorized("No refresh token");

        var user = await _service.GetUserByRefreshTokenAsync(refreshToken);
        if (user == null) return Unauthorized("Invalid or expired refresh token");

        var (accessToken, _, _) = _tokenService.GenerateTokens(user, false);

        Response.Cookies.Append("accessToken", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.Now.AddMinutes(10),

        });

        return Ok(ApiResponse<string>.Ok("Access token refreshed"));
    }

    [HttpGet("{UserId}")]
    public async Task<ActionResult<ApiResponse<User>>> Get(string UserId)
    {
        var user = await _service.GetByidAsync(UserId);
        if (user is null)
            return NotFound(ApiResponse<User>.Error("User not found."));
        return Ok(ApiResponse<User>.Ok(user));
    }

    // Utility to set cookies
    private void SetAuthCookies(string accessToken, string refreshToken, DateTime refreshExpiry)
    {
        Response.Cookies.Append("accessToken", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.Now.AddMinutes(10)
        });

        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = refreshExpiry
        });
    }
    // UserController.cs
    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<UserDTO>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _service.GetByidAsync(userId);
        if (user == null) return NotFound();

        return Ok(new UserDTO
        {
            UserId = user.UserId,
            Name = user.Name,
            UserName = user.UserName,
            Role = user.Role,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
        });
    }
}
