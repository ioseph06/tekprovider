using Microsoft.AspNetCore.Authorization;

namespace PruebaTekProvider.Api.Authorization
{
    public sealed class HasPermissionAttribute : AuthorizeAttribute
    {
        public HasPermissionAttribute(string permission) => Policy = permission;
    }
}
