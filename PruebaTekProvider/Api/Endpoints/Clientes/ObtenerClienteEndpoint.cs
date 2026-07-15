using FastEndpoints;
using PruebaTekProvider.Core.Tek.Application;
using Perms = PruebaTekProvider.Core.Shared.Permissions;

namespace PruebaTekProvider.Api.Endpoints.Clientes
{
    public class ObtenerClienteRequest
    {
        public Guid Id { get; set; }   // se enlaza desde la ruta {id}
    }

    public class ObtenerClienteEndpoint(IClienteService clienteService) : Endpoint<ObtenerClienteRequest, ClienteDto>
    {
        private readonly IClienteService _clienteService = clienteService;

        public override void Configure()
        {
            Get("api/v1/cliente/{id:guid}");
            Policies(Perms.Cliente.Ver);
        }

        public override async Task HandleAsync(ObtenerClienteRequest req, CancellationToken ct)
        {
            var cliente = await _clienteService.ObtenerAsync(req.Id);
            if (cliente is null)
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            await Send.OkAsync(cliente, ct);
        }
    }
}
