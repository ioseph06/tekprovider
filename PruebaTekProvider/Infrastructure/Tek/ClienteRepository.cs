using Microsoft.EntityFrameworkCore;
using PruebaTekProvider.Core.Common;
using PruebaTekProvider.Core.Tek.Application;
using PruebaTekProvider.Core.Tek.Domain;
using PruebaTekProvider.Infrastructure.Data;
using System.Linq;

namespace PruebaTekProvider.Infrastructure.Tek
{
    public class ClienteRepository(AppDbContext context) : IClienteRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AgregarAsync(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
        }

        public Task<bool> ExisteEmailAsync(string email, Guid? excluirId = null)
        {
            return _context.Clientes.AnyAsync(b => b.Email == email && (excluirId == null || b.Id != excluirId));
        }

        public Task<bool> ExisteRFCAsync(string rfc, Guid? excluirId = null)
        {
            return _context.Clientes.AnyAsync(b => b.RFC == rfc && (excluirId == null || b.Id != excluirId));
        }

        public Task GuardarCambiosAsync() => _context.SaveChangesAsync();

        public Task<PagedResult<Cliente>> ListarAsync(ParametrosPaginacion p)
        {
            var query = _context.Clientes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(p.Buscar))
                query = query.Where(c => EF.Functions.ILike(c.Nombre, $"%{p.Buscar}%") ||
                                         EF.Functions.ILike(c.RFC, $"%{p.Buscar}%") ||
                                         EF.Functions.ILike(c.Email, $"%{p.Buscar}%"));


            query = (p.OrdenarPor?.Trim().ToLowerInvariant()) switch
            {
                "nombre" => query.AplicarOrden(b => b.Nombre, p.Desc),
                "rfc" => query.AplicarOrden(b => b.RFC, p.Desc),
                "email" => query.AplicarOrden(b => b.Email, p.Desc),                
                _ => query.OrderByDescending(b => b.Id),
            };

            return query.ToPagedResultAsync(p);
        }

        public async Task<Cliente?> ObtenerPorIdAsync(Guid id)
            => await _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);

    }
}
