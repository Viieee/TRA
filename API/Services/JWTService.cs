using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace API.Services
{
    public class JWTService
    {
        private readonly string _secret;
        private readonly string _expDate;

        public JWTService(IConfiguration config)
        {
            // from appsettings.json
            _secret = config.GetSection("JWT").GetSection("Key").Value;
            _expDate = config.GetSection("JWT").GetSection("expirationInMinutes").Value;
        }

        public string GenerateSecurityToken(int id, string email, string name, List<string> roles)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secret);
            var subject = new ClaimsIdentity(new Claim[] {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Name, name),
            });
            foreach (string role in roles)
            {
                subject.AddClaim(new Claim(ClaimTypes.Role, role));
            }
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = subject,
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_expDate)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor); // making the token

            return tokenHandler.WriteToken(token); // returning the token as a string

        }
    }
}
