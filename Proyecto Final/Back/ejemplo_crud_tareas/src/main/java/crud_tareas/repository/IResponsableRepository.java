package crud_tareas.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import crud_tareas.entity.Responsable;


public interface IResponsableRepository extends JpaRepository <Responsable, Long>{
	@Query("SELECT d FROM Responsable d WHERE LOWER(d.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Responsable> findByNombreContaining(@Param("nombre") String nombre);
	
	@Query("SELECT d FROM Responsable d WHERE LOWER(d.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))")
    List<Responsable> findByApellidoContaining(@Param("apellido") String apellido); 
	
	@Query("SELECT d FROM Responsable d WHERE LOWER(d.correo) LIKE LOWER(CONCAT('%', :correo, '%'))")
    List<Responsable> findByCorreoContaining(@Param("correo") String correo); 
	
	@Query("SELECT d FROM Responsable d WHERE d.departamento IS NOT NULL AND LOWER(d.departamento.nombre) LIKE LOWER(CONCAT('%', :departamento, '%'))")
	List<Responsable> findByDepartamentoContaining(@Param("departamento") String departamento);

	@Query("SELECT d FROM Responsable d WHERE d.puesto IS NOT NULL AND LOWER(d.puesto.nombre) LIKE LOWER(CONCAT('%', :puesto, '%'))")
	List<Responsable> findByPuestoContaining(@Param("puesto") String puesto);

	
}
