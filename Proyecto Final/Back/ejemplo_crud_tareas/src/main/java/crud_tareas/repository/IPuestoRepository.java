package crud_tareas.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import crud_tareas.entity.Puesto;


public interface IPuestoRepository extends JpaRepository <Puesto, Long>{
	@Query("SELECT d FROM Puesto d WHERE LOWER(d.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Puesto> findByNombreContaining(@Param("nombre") String nombre);
} 
