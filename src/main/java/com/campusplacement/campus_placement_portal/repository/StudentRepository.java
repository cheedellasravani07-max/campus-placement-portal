package com.campusplacement.campus_placement_portal.repository;

import com.campusplacement.campus_placement_portal.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

}