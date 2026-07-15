namespace PruebaTekProvider.Core.Tek.Application
{
    public class ClienteDto
    {
        public Guid Id { get;  set; }
        public string Nombre { get;  set; } = string.Empty;
        public string RFC { get;  set; } = string.Empty;
        public string Email { get;  set; } = null!;
        public string Telefono { get;  set; } = string.Empty;
        public string Estado { get;  set; } = string.Empty;
        public string FechaAlta { get; set; } = "01/01/1900";
    }


    public class CrearClienteDto
    {    
        public string Nombre { get;  set; } = string.Empty;
        public string RFC { get;  set; } = string.Empty;
        public string Email { get;  set; } = null!;
        public string Telefono { get;  set; } = string.Empty;                
    }


    public class EditarClienteDto
    {
        public Guid Id { get;  set; }
        public string Nombre { get;  set; } = string.Empty;
        public string RFC { get;  set; } = string.Empty;
        public string Email { get;  set; } = null!;
        public string Telefono { get;  set; } = string.Empty;
    }


    public class CambiarEstadoClienteDto
    {
        public Guid Id { get;  set; }
        public string Estado { get;  set; } = string.Empty;
    }


}
