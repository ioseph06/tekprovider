using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PruebaTekProvider.Core.Shared;
using PruebaTekProvider.Core.Tek.Domain;

namespace PruebaTekProvider.Infrastructure.Tek
{
    public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
    {
        public void Configure(EntityTypeBuilder<Cliente> builder)
        {
            builder.ToTable("Clientes");
            
            builder.HasKey(a => a.Id);
            
            builder.Property(a => a.Nombre)
                .HasMaxLength(200)
                .IsRequired();
            
            builder.Property(a => a.RFC)
                .HasMaxLength(13);


            builder.Property(c => c.Email)                                
                .HasMaxLength(200)
                .IsRequired();

            builder.Property(c => c.Telefono)
                .HasConversion(tel => tel!.Valor, valor => Telefono.Crear(valor))
                .HasColumnName("Telefono")
                .HasMaxLength(20);
            
            builder.Property(c => c.EstadoCliente).HasConversion<string>().HasMaxLength(20);
            builder.Property(a => a.FechaAlta);
        }
    }
}
