using Microsoft.AspNetCore.Authorization;

namespace PruebaTekProvider.Api.Authorization
{
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        public const string ClaimType = "permission";

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            if (context.User.HasClaim(ClaimType, requirement.Permission))
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
