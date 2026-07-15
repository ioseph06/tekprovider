import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clienteService } from '../services/api';
import './Clientes.css';

const PAGE_SIZE = 10;

/**
 * Página de Clientes
 * Tabla con listado paginado y botones de Nuevo / Editar
 */
export default function Clientes() {
  // ============ HOOKS ============
  const navigate = useNavigate();

  const [data, setData] = useState(null); // Respuesta paginada completa
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Búsqueda: `busqueda` es lo que se escribe, `buscar` lo que se envía a la API (con debounce)
  const [busqueda, setBusqueda] = useState('');
  const [buscar, setBuscar] = useState('');

  // Modal de edición: null = cerrado, objeto = cliente en edición
  const [clienteEditando, setClienteEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState(null);

  // Id del cliente cuyo estado se está cambiando (deshabilita su botón)
  const [cambiandoEstadoId, setCambiandoEstadoId] = useState(null);

  // ============ CARGA DE DATOS ============
  const obtenerClientes = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await clienteService.getAll(pagina, PAGE_SIZE, buscar);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail ?? err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, [pagina, buscar]);

  // Debounce: aplicar la búsqueda 400ms después de dejar de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscar(busqueda.trim());
      setPagina(1); // Al buscar, volver a la primera página
    }, 400);
    return () => clearTimeout(timer);
  }, [busqueda]);

  // ============ MANEJADORES ============
  // El modal sirve para editar (con id) y para crear (id = null)
  const handleNuevo = () => {
    setErrorModal(null);
    setClienteEditando({
      id: null,
      nombre: '',
      rfc: '',
      email: '',
      telefono: '',
    });
  };

  const handleEditar = (cliente) => {
    setErrorModal(null);
    setClienteEditando({
      id: cliente.id,
      nombre: cliente.nombre ?? '',
      rfc: cliente.rfc ?? '',
      email: cliente.email ?? '',
      telefono: cliente.telefono ?? '',
    });
  };

  const handleCerrarModal = () => {
    if (!guardando) setClienteEditando(null);
  };

  const handleCampoChange = (e) => {
    const { name, value } = e.target;
    setClienteEditando((c) => ({ ...c, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrorModal(null);
    try {
      if (clienteEditando.id) {
        await clienteService.update(clienteEditando.id, clienteEditando);
      } else {
        const { id, ...nuevoCliente } = clienteEditando;
        await clienteService.create(nuevoCliente);
      }
      setClienteEditando(null);
      await obtenerClientes(); // Refrescar la tabla
    } catch (err) {
      setErrorModal(err.response?.data?.detail ?? err.message);
    } finally {
      setGuardando(false);
    }
  };

  const esActivo = (cliente) => cliente.estado?.toLowerCase() === 'activo';
  const esSuspendido = (cliente) =>
    cliente.estado?.toLowerCase() === 'suspendido';

  const handleCambiarEstado = async (cliente, nuevoEstado) => {
    // Pedir confirmación al desactivar o suspender (activar es directo)
    const confirmaciones = {
      Inactivo: `¿Seguro que deseas desactivar al cliente "${cliente.nombre}"?`,
      Suspendido: `¿Seguro que deseas suspender al cliente "${cliente.nombre}"?`,
    };
    if (confirmaciones[nuevoEstado] && !window.confirm(confirmaciones[nuevoEstado])) {
      return;
    }

    setCambiandoEstadoId(cliente.id);
    setError(null);
    try {
      await clienteService.cambiarEstado(cliente.id, nuevoEstado);
      await obtenerClientes(); // Refrescar la tabla
    } catch (err) {
      setError(err.response?.data?.detail ?? err.message);
    } finally {
      setCambiandoEstadoId(null);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const d = new Date(fecha);
    return isNaN(d) ? fecha : d.toLocaleDateString('es-ES');
  };

  const items = data?.items ?? [];

  // ============ RENDER ============
  return (
    <div className="clientes-container">
      {/* Toolbar */}
      <div className="clientes-header">
        <div>
          <h1>👥 Clientes</h1>
          <p className="clientes-sub">Listado de clientes registrados</p>
        </div>
        <div className="clientes-actions">
          <button className="btn-secundario" onClick={() => navigate('/')}>
            ← Volver
          </button>
          <button className="btn-primario" onClick={handleNuevo}>
            + Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="clientes-busqueda">
        <input
          type="search" 
          placeholder="🔍 Buscar por nombre, RFC, email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && <div className="clientes-error">⚠️ {error}</div>}

      {/* Tabla */}
      <div className="clientes-card">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RFC</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Fecha Alta</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={7} className="celda-vacia">
                  Cargando clientes...
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.rfc}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                    <span
                      className={
                        'tag ' +
                        (esActivo(cliente)
                          ? 't-green'
                          : esSuspendido(cliente)
                          ? 't-amber'
                          : 't-gray')
                      }
                    >
                      {cliente.estado}
                    </span>
                  </td>
                  <td>{formatearFecha(cliente.fechaAlta)}</td>
                  <td className="col-acciones">
                    <button
                      className="btn-editar"
                      onClick={() => handleEditar(cliente)}
                    >
                      ✏️ Editar
                    </button>

                    {esActivo(cliente) ? (
                      <>
                        {/* Activo: puede desactivarse o suspenderse */}
                        <button
                          className="btn-desactivar"
                          onClick={() => handleCambiarEstado(cliente, 'Inactivo')}
                          disabled={cambiandoEstadoId === cliente.id}
                        >
                          {cambiandoEstadoId === cliente.id ? '...' : 'Desactivar'}
                        </button>
                        <button
                          className="btn-suspender"
                          onClick={() =>
                            handleCambiarEstado(cliente, 'Suspendido')
                          }
                          disabled={cambiandoEstadoId === cliente.id}
                        >
                          {cambiandoEstadoId === cliente.id ? '...' : 'Suspender'}
                        </button>
                      </>
                    ) : (
                      /* Inactivo o Suspendido: solo puede activarse */
                      <button
                        className="btn-activar"
                        onClick={() => handleCambiarEstado(cliente, 'Activo')}
                        disabled={cambiandoEstadoId === cliente.id}
                      >
                        {cambiandoEstadoId === cliente.id ? '...' : 'Activar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}

            {!cargando && !error && items.length === 0 && (
              <tr>
                <td colSpan={7} className="celda-vacia">
                  {buscar
                    ? `No hay clientes que coincidan con "${buscar}".`
                    : 'No hay clientes registrados.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {data && (
          <div className="clientes-paginacion">
            <button
              className="btn-secundario"
              disabled={!data.hasPreviousPage}
              onClick={() => setPagina((p) => p - 1)}
            >
              ← Anterior
            </button>
            <span>
              Página {data.pageNumber} de {data.totalPages} ({data.totalCount}{' '}
              clientes)
            </span>
            <button
              className="btn-secundario"
              disabled={!data.hasNextPage}
              onClick={() => setPagina((p) => p + 1)}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {/* ============ MODAL DE CLIENTE (crear / editar) ============ */}
      {clienteEditando && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {clienteEditando.id ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}
              </h2>
              <button
                className="modal-cerrar"
                onClick={handleCerrarModal}
                disabled={guardando}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardar}>
              <div className="modal-body">
                {errorModal && (
                  <div className="clientes-error">⚠️ {errorModal}</div>
                )}

                <label className="modal-campo">
                  <span>Nombre</span>
                  <input
                    name="nombre"
                    value={clienteEditando.nombre}
                    onChange={handleCampoChange}
                    required
                  />
                </label>

                <label className="modal-campo">
                  <span>RFC</span>
                  <input
                    name="rfc"
                    value={clienteEditando.rfc}
                    onChange={handleCampoChange}
                    required
                  />
                </label>

                <label className="modal-campo">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    value={clienteEditando.email}
                    onChange={handleCampoChange}
                    required
                  />
                </label>

                <label className="modal-campo">
                  <span>Teléfono</span>
                  <input
                    name="telefono"
                    value={clienteEditando.telefono}
                    onChange={handleCampoChange}
                    required
                  />
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secundario"
                  onClick={handleCerrarModal}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primario"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
