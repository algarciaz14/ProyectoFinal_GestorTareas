package crud_tareas.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import crud_tareas.entity.Proyecto;


public interface IProyectoRepository extends JpaRepository <Proyecto, Long>{
	@Query("SELECT d FROM Proyecto d WHERE LOWER(d.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Proyecto> findByNombreContaining(@Param("nombre") String nombre);
	
	@Query("SELECT d FROM Proyecto d WHERE LOWER(d.descripcion) LIKE LOWER(CONCAT('%', :descripcion, '%'))")
    List<Proyecto> findByDescripcionContaining(@Param("descripcion") String descripcion); 
}
