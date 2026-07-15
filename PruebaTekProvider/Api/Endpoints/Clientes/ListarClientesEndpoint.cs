using FastEndpoints;
using PruebaTekProvider.Core.Common;
using PruebaTekProvider.Core.Tek.Application;
using Perms = PruebaTekProvider.Core.Shared.Permissions;

namespace PruebaTekProvider.Api.Endpoints.Clientes
{
    // GET /api/v1/cliente?page=1&pageSize=20&buscar=acme
    public class ListarClientesEndpoint(IClienteService clienteService) : Endpoint<ParametrosPaginacion, PagedResult<ClienteDto>>
    {
        private readonly IClienteService _clienteService = clienteService;

        public override void Configure()
        {
            Get("api/v1/cliente");
            Policies(Perms.Cliente.Ver);
        }

        public override async Task HandleAsync(ParametrosPaginacion req, CancellationToken ct)
            => await Send.OkAsync(await _clienteService.ListarAsync(req), ct);
    }
}
