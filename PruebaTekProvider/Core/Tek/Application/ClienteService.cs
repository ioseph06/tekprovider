using PruebaTekProvider.Core.Common;
using PruebaTekProvider.Core.Shared;
using PruebaTekProvider.Core.Tek.Domain;

namespace PruebaTekProvider.Core.Tek.Application
{
    public class ClienteService(IClienteRepository repo) : IClienteService
    {

        private readonly IClienteRepository _repo = repo;

        public async Task <Result<ClienteDto>> CambiarEstadoAsync(Guid id, CambiarEstadoClienteDto dto)
        {
            var cliente = await _repo.ObtenerPorIdAsync(id);
            if (cliente is null)
                return Result<ClienteDto>.Failure("Cliente no encontrado");

            try
            {
                cliente.Cambiar(id, ParseEstado(dto.Estado));
            }
            catch (DomainException ex)
            {
                return Result<ClienteDto>.Failure(ex.Message);
            }

            await _repo.GuardarCambiosAsync();
            
            return Result<ClienteDto>.Success(cliente.ToDto());
        }

        public async Task <Result<ClienteDto>> CrearAsync(CrearClienteDto dto)
        {
            if (await _repo.ExisteRFCAsync(dto.RFC))
                return Result<ClienteDto>.Failure("La RFC ya esta registrado");

            if (await _repo.ExisteEmailAsync(dto.Email))
                return Result<ClienteDto>.Failure("Email ya esta registrado");

            try
            {
                var cliente = Cliente.Crear(dto.Nombre, dto.RFC, dto.Email, dto.Telefono);
                await _repo.AgregarAsync(cliente);              
                return Result<ClienteDto>.Success(cliente.ToDto());
            }
            catch (DomainException ex)
            {
                return Result<ClienteDto>.Failure(ex.Message);
            }
        }

        public async Task <Result<ClienteDto>> EditarAsync(Guid id, EditarClienteDto dto)
        {

            var cliente = await _repo.ObtenerPorIdAsync(id);
            if (cliente is null)
                return Result<ClienteDto>.Failure("Cliente no encontrado");

            var email = dto.Email.Trim().ToUpperInvariant();
            var rfc = dto.RFC.Trim().ToUpperInvariant();
            if (await _repo.ExisteRFCAsync(rfc, excluirId: id))
                return Result<ClienteDto>.Failure($"Ya existe otro cliente con el RFC '{rfc}'.");

            if (await _repo.ExisteEmailAsync(email, excluirId: id))
                return Result<ClienteDto>.Failure($"Ya existe otro cliente con el Email '{email}'.");

            try
            {
                cliente.Editar(dto.Nombre, dto.RFC, dto.Email, dto.Telefono);
            }
            catch (DomainException ex)
            {
                return Result<ClienteDto>.Failure(ex.Message);
            }

            await _repo.GuardarCambiosAsync();
            return Result<ClienteDto>.Success(cliente.ToDto());
        }

        public async Task<PagedResult<ClienteDto>> ListarAsync(ParametrosPaginacion parametros)
        {
            var pagina = await _repo.ListarAsync(parametros);
            return new PagedResult<ClienteDto>
            {
                Items = pagina.Items.Select(b => b.ToDto()),
                PageNumber = pagina.PageNumber,
                PageSize = pagina.PageSize,
                TotalCount = pagina.TotalCount
            };
        }

        private static Estado ParseEstado(string? estado)
                => string.IsNullOrWhiteSpace(estado) ? Estado.Activo : Enum.Parse<Estado>(estado, ignoreCase: true);

        public async Task<ClienteDto?> ObtenerAsync(Guid id)
        {
           return (await _repo.ObtenerPorIdAsync(id))?.ToDto();
        }
    }
}
