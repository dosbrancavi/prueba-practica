package org.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String username;

    @Column(length = 9)
    private String phoneNumber;

    private Integer age;

    @Column(nullable = false)
    private String gender;

    @Column(length = 4000)
    private String password;

    @Column(name = "public_key", length = 4000)
    private String publicKeyBase64;

    @Column(name = "private_key", length = 4000)
    private String privateKeyBase64;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Task> tasks;

    public User(String username, String phoneNumber, Integer age, String gender, String password) {
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.age = age;
        this.gender = gender;
        this.password = password;
    }
}
