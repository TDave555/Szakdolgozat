package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.create.CreateUserDto;
import hu.me.iit.internshipregistrybackend.dtos.read.UserDto;
import hu.me.iit.internshipregistrybackend.entities.User;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.UserMapper;
import hu.me.iit.internshipregistrybackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userMapper.toDtoList(userRepository.findAll());
    }

    public UserDto getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.toDto(user);
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User with username: '" + username + "' not found",
                        HttpStatus.NOT_FOUND));
        return userMapper.toDto(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public UserDto createUser(CreateUserDto userDto) {
        User createUser = User.builder()
                .username(userDto.getUsername())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .role(userDto.getRole())
                .build();
        return userMapper.toDto(userRepository.save(createUser));
    }

    public UserDto updateUser(Long id, CreateUserDto userDto) {
        User updateUser = userRepository.findById(id)
                        .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        updateUser.setUsername(userDto.getUsername());
        updateUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return userMapper.toDto(userRepository.save(updateUser));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
