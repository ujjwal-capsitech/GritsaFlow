using GritsaFlow.DTOs;
using GritsaFlow.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public (string accessToken, string refreshToken, DateTime refreshExpiry) GenerateTokens(UserDTO user, bool includeRefresh = true)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var accessToken = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(10),
            signingCredentials: creds
        );

        var accessTokenStr = new JwtSecurityTokenHandler().WriteToken(accessToken);

        if (!includeRefresh)
            return (accessTokenStr, "", DateTime.MinValue); 

        var refreshToken = Guid.NewGuid().ToString();
        var refreshExpiry = DateTime.Now.AddHours(10);

        return (accessTokenStr, refreshToken, refreshExpiry);
    }

    public bool ValidateRefreshToken(string refreshToken)
    {
        // Basic validation — you can enhance this by checking DB for existence and expiry
        return !string.IsNullOrEmpty(refreshToken);
    }
}
