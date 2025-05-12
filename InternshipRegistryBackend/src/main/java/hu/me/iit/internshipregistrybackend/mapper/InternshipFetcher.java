package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.entities.Internship;
import hu.me.iit.internshipregistrybackend.repositories.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.ObjectFactory;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
class InternshipFetcher {
    private final InternshipRepository internshipRepository;

    //for mappers that need to change internshipId back to Internship entity

    @ObjectFactory
    public Internship fromId(Long internshipId) {
        if (internshipId != null)
            return internshipRepository.findById(internshipId).orElse(null);
        return null;
    }
}
