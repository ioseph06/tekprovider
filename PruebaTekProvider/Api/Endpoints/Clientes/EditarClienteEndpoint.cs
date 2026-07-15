using FastEndpoints;
using PruebaTekProvider.Core.Tek.Application;
using Perms = PruebaTekProvider.Core.Shared.Permissions;

namespace PruebaTekProvider.Api.Endpoints.Clientes
{
    public class EditarClienteEndpoint(IClienteService clienteService) : Endpoint<EditarClienteDto, ClienteDto>
    {
        private readonly IClienteService _clienteService = clienteService;

        public override void Configure()
        {
            Put("api/v1/cliente/{id:guid}");
            Policies(Perms.Cliente.Editar);
        }

        public override async Task HandleAsync(EditarClienteDto req, CancellationToken ct)
        {
            var result = await _clienteService.EditarAsync(req.Id, req);

            if (result.IsSuccess)
            {
                await Send.OkAsync(result.Value!, ct);
                return;
            }

            if (result.Error == "Cliente no encontrado")
            {
                await Send.NotFoundAsync(ct);
                return;
            }

            AddError(result.Error!);
            await Send.ErrorsAsync(400, ct);
        }
    }
}
