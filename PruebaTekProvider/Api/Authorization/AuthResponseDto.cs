namespace PruebaTekProvider.Api.Authorization
{
    public class AuthResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;            // access token (JWT, corto)
        public DateTime Expiration { get; set; }
        public string RefreshToken { get; set; } = string.Empty;     // refresh token (opaco, largo)
        public DateTime RefreshTokenExpiration { get; set; }
        public IEnumerable<string> Roles { get; set; } = new List<string>();
        public IEnumerable<string> Permisos { get; set; } = new List<string>();
    }
}
