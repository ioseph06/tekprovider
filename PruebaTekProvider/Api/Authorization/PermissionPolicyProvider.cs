using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using PruebaTekProvider.Core.Shared;

namespace PruebaTekProvider.Api.Authorization
{
    public class PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : IAuthorizationPolicyProvider
    {
        private readonly DefaultAuthorizationPolicyProvider _fallback = new(options);
        public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => _fallback.GetDefaultPolicyAsync();
        public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => _fallback.GetFallbackPolicyAsync();

        public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
        {
            // Si el nombre coincide con un permiso conocido, generamos una política que exige
            // estar autenticado y poseer ese permiso. Cualquier otro nombre → proveedor por defecto.
            if (Permissions.Todos.Contains(policyName))
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddRequirements(new PermissionRequirement(policyName))
                    .Build();

                return Task.FromResult<AuthorizationPolicy?>(policy);
            }

            return _fallback.GetPolicyAsync(policyName);
        }
    }
}
