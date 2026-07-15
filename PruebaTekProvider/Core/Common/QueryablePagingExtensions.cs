using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace PruebaTekProvider.Core.Common
{
    public static class QueryablePagingExtensions
    {
        // Aplica OrderBy/OrderByDescending de forma tipada y reutilizable. Lo usa cada repositorio
        // dentro de un 'switch' sobre los campos que admite ordenar (whitelist), p. ej.:
        //   "nombre" => query.AplicarOrden(l => l.Nombre, p.Desc),
        public static IOrderedQueryable<T> AplicarOrden<T, TKey>(
            this IQueryable<T> query, Expression<Func<T, TKey>> selector, bool desc)
            => desc ? query.OrderByDescending(selector) : query.OrderBy(selector);

        public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
            this IQueryable<T> query, ParametrosPaginacion p, CancellationToken ct = default)
        {
            var total = await query.CountAsync(ct);
            var items = await query
                .Skip((p.Page - 1) * p.PageSize)
                .Take(p.PageSize)
                .ToListAsync(ct);

            return new PagedResult<T>
            {
                Items = items,
                PageNumber = p.Page,
                PageSize = p.PageSize,
                TotalCount = total
            };
        }

    }
}
