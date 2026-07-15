using PruebaTekProvider.Core.Shared;

namespace PruebaTekProvider.Core.Tek.Domain
{
    public class Cliente
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string RFC { get; set; } = string.Empty;
        public string Email { get; set; }
        public Telefono Telefono { get; set; }
        public Estado EstadoCliente { get; set; }
        public DateTime FechaAlta { get; set; }
        public bool EstaActivo => EstadoCliente == Estado.Activo;


        private Cliente() { }

        private Cliente(string nombre, string rfc, string email, Telefono telefono)
        {
            Id = Guid.NewGuid();
            Nombre = nombre;
            RFC = rfc;
            Email = email;
            Telefono = telefono;
            EstadoCliente = Estado.Activo;
            FechaAlta = DateTime.UtcNow;
        }

        public static Cliente Crear(string nombre, string RFC, string email, string telefono)
        {

            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("Nombre es obligatorio");
            if (string.IsNullOrWhiteSpace(RFC))
                throw new DomainException("RFC es obligatorio");
            if (ValidarEmail(email))
                throw new DomainException("Email no valido");


            var tel = string.IsNullOrWhiteSpace(telefono) ? null : Telefono.Crear(telefono);

            return new Cliente(nombre.Trim(), RFC.Trim(), email, tel);
        }

        public void Editar(string nombre, string rfc, string email, string telefono)
        {

            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("Nombre es obligatorio");
            if (string.IsNullOrWhiteSpace(rfc))
                throw new DomainException("RFC es obligatorio");
            if (ValidarEmail(email))
                throw new DomainException("Email no valido");

            var tel = string.IsNullOrWhiteSpace(telefono) ? null : Telefono.Crear(telefono);

            Nombre = nombre;
            RFC = rfc.Trim();
            Email = email;
            Telefono = Telefono.Crear(telefono);

        }

        public void Cambiar(Guid cuentaId, Estado estado)
        {
            if (EstadoCliente == Estado.Inactivo || EstadoCliente == Estado.Suspendido)
            {
                if (estado != Estado.Activo)
                {                    
                    throw new DomainException("Inactivo/Suspendido solo puede usar Activo");
                }
            }

            EstadoCliente = estado;
        }

        public static bool ValidarEmail(string valor)
        {
            bool bExito = false;

            if (string.IsNullOrWhiteSpace(valor) || !valor.Contains('@') || !valor.Contains('.'))
                //    throw new DomainException($"Email inválido: '{valor}'");
                bExito = true;

            return bExito;
            
        }


    }
}
