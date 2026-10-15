
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // =====================================================
    // 1. USUARIOS
    // =====================================================
    // Agrego la columna imagen_url a la tabla usuarios.
    
    await queryInterface.addColumn("usuarios", "imagen_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    // Agrego la columna estado a usuarios.
    // ENUM limita los valores permitidos a ACTIVO o INACTIVO.
    
    await queryInterface.addColumn("usuarios", "estado", {
      type: Sequelize.ENUM("ACTIVO", "INACTIVO"),
      allowNull: false,
      defaultValue: "ACTIVO",
    });
    
    // =====================================================
    // 2. COMPLEJOS
    // =====================================================
    // Agrego imagen_url para guardar la referencia
    // a la imagen del complejo.
    await queryInterface.addColumn("complejos", "imagen_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    // Agrego estado para indicar si el complejo
    // está activo o inactivo.
    // Los registros existentes recibirán ACTIVO
    // como valor predeterminado.
    await queryInterface.addColumn("complejos", "estado", {
      type: Sequelize.ENUM("ACTIVO", "INACTIVO"),
      allowNull: false,
      defaultValue: "ACTIVO",
    });
    
    // =====================================================
    // 3. CANCHAS
    // =====================================================
    // Agrego imagen_url para la imagen de cada cancha.
    // Prohibo NULL porque la imagen es obligatoria.
    await queryInterface.addColumn("canchas", "imagen_url", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    
    // Agrego estado para controlar si una cancha
    // está activa o inactiva.
    // El valor predeterminado será ACTIVO.
    await queryInterface.addColumn("canchas", "estado", {
      type: Sequelize.ENUM("ACTIVO", "INACTIVO"),
      allowNull: false,
      defaultValue: "ACTIVO",
    });
    
    // =====================================================
    // 4. RESERVAS
    // =====================================================
    // Agrego horario_id a reservas.
    // Esta columna permite identificar el horario
    // asociado a cada reserva.
    
    await queryInterface.addColumn("reservas", "horario_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      
      // Defino la clave foránea:
      // horario_id referencia a horarios.id.
      // PostgreSQL verifica que el horario exista
      // cuando se informe un horario_id no nulo.
      references: {
        model: "horarios",
        key: "id",
      },
      
      // Si cambia el identificador de un horario,
      // el cambio se propaga a las referencias.
      onUpdate: "CASCADE",
      
      // No permite eliminar un horario si existen
      // reservas que lo referencian.
      onDelete: "RESTRICT",
    });
    
    // =====================================================
    // 5. PAGOS
    // =====================================================
    // Agrego comprobante_url para guardar la referencia
    // al comprobante del pago.
    // Permito NULL porque no todos los pagos
    // necesariamente tendrán un comprobante cargado.
    await queryInterface.addColumn("pagos", "comprobante_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {

    // Revierto el cambio realizado en pagos.
    await queryInterface.removeColumn("pagos", "comprobante_url");

    // Bajo la clave foránea de reservas junto con
    // su columna horario_id.
    await queryInterface.removeColumn("reservas", "horario_id");

    // Revierto las columnas agregadas a canchas.
    await queryInterface.removeColumn("canchas", "estado");
    await queryInterface.removeColumn("canchas", "imagen_url");

    // Revierto las columnas agregadas a complejos.
    await queryInterface.removeColumn("complejos", "estado");
    await queryInterface.removeColumn("complejos", "imagen_url");

    // Revierto las columnas agregadas a usuarios.
    await queryInterface.removeColumn("usuarios", "estado");
    await queryInterface.removeColumn("usuarios", "imagen_url");
  },
};
