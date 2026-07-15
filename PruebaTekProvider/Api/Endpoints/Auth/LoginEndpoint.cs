using FastEndpoints;
using Microsoft.IdentityModel.Tokens;
using PruebaTekProvider.Api.Authorization;
using PruebaTekProvider.Core.Shared;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PruebaTekProvider.Api.Endpoints.Auth
{
    public class LoginEndpoint(IConfiguration configuration) : Endpoint<LoginDto, AuthResponseDto>
    {
        private readonly IConfiguration _configuration = configuration;

        public override void Configure()
        {
            Post("api/auth/login");
            AllowAnonymous();
        }

        public override async Task HandleAsync(LoginDto req, CancellationToken ct)
        {
            // TODO: verificar credenciales reales (Identity/SignInManager) antes de emitir el token.
            await Send.OkAsync(EmitirTokens(), ct);
        }

        private AuthResponseDto EmitirTokens()
        {
            var roles = new List<string> { "Admin" };
            var permisos = RolePermissions.ParaRoles(roles).ToList();
            var (accessToken, accessExpira) = GenerarAccessToken(roles, permisos);

            return new AuthResponseDto
            {
                Id = "0025",
                Email = "email@email.com",
                Token = accessToken,
                Expiration = accessExpira,
                Roles = roles,
                Permisos = permisos   // útil para que el frontend muestre/oculte acciones
            };
        }

        private (string token, DateTime expira) GenerarAccessToken(
                    IList<string> roles, IList<string> permisos)
        {
            // 🔐 Misma clave que valida el middleware; obligatoria por configuración, nunca hardcodeada.
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Falta 'Jwt:Key' en la configuración.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var minutos = int.TryParse(_configuration["Jwt:AccessTokenMinutes"], out var m) ? m : 15;
            var expira = DateTime.UtcNow.AddMinutes(minutos);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, "0025"),
                new(JwtRegisteredClaimNames.Email,"email@email.com"),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            // 🔐 Permisos finos como claims 'permission' (los endpoints usan Policies(...)).
            claims.AddRange(permisos.Select(p => new Claim(PermissionAuthorizationHandler.ClaimType, p)));

            var token = new JwtSecurityToken(expires: expira, claims: claims, signingCredentials: creds);
            return (new JwtSecurityTokenHandler().WriteToken(token), token.ValidTo);
        }
    }
}
