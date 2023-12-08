package com.laconic.pcms.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laconic.pcms.entity.Company;
import com.laconic.pcms.entity.Stage;
import com.laconic.pcms.entity.TaskStage;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.repository.ICompanyRepo;
import com.laconic.pcms.repository.IStageRepo;
import com.laconic.pcms.repository.ITaskStageRepo;
import com.laconic.pcms.repository.IUserRepo;
import jakarta.transaction.Transactional;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Component
@Transactional
public class DataLoader implements ApplicationRunner {

    private final IUserRepo userRepo;
    private final ICompanyRepo companyRepo;
    private final BCryptPasswordEncoder encoder;
    private final IStageRepo stageRepo;
    private final ITaskStageRepo taskStageRepo;

    public DataLoader(IUserRepo userRepo,
                      ICompanyRepo companyRepo,
                      BCryptPasswordEncoder encoder,
                      IStageRepo stageRepo,
                      ITaskStageRepo taskStageRepo) {
        this.userRepo = userRepo;
        this.companyRepo = companyRepo;
        this.encoder = encoder;
        this.stageRepo = stageRepo;
        this.taskStageRepo = taskStageRepo;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
//        boolean userExists = userRepo.count() > 0;
        boolean companyExists = companyRepo.count() > 0;
        var password = encoder.encode("12345");
        boolean stageDataExists = stageRepo.count() > 0;
        boolean taskStageDataExists = taskStageRepo.count() > 0;

//        if (!userExists) {
//            List<User> users = new ArrayList<>();
//            users.add(User.builder().email("admin@gmail.com").fullName("Admin Admin").password(password).build());
//            users.add(User.builder().email("kong@gmail.com").fullName("Kong Kong").password(password).build());
//            users.add(User.builder().email("mandip@gmail.com").fullName("Mandip Mandip").password(password).build());
//            users.add(User.builder().email("mike@gmail.com").fullName("Mike Shinoda").password(password).build());
//            users.add(User.builder().email("john@gmail.com").fullName("John Stone").password(password).build());
//            users.add(User.builder().email("bob@gmail.com").fullName("Bob Marley").password(password).build());
//            this.userRepo.saveAll(users);
//        }

        if (!companyExists) {
            this.companyRepo.save(Company.builder().name("New Company").build());
        }


        if (!stageDataExists) {
            Stage stage = new Stage();
            stage.setName("New");
            stage.setActive(true);
            stage.setIsFold(true);
            stageRepo.save(stage);
        }

        if (!taskStageDataExists) {
            String[] taskTageList = new String[]{
                    "{\"name\":\"NEW\", \"color\": \"#FCA5A5\" }",
                    "{\"name\":\"TO DO\", \"color\": \"#FDE047\" }",
                    "{\"name\":\"IN PROGRESS\", \"color\": \"#93C5FD\" }",
                    "{\"name\":\"DONE\", \"color\": \"#86EFAC\" }"
            };

            List<TaskStage> taskStages = Arrays.stream(taskTageList)
                    .map(json -> {
                        try {
                            ObjectMapper objectMapper = new ObjectMapper();
                            return objectMapper.readValue(json, TaskStage.class);
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .toList();
            taskStageRepo.saveAll(taskStages);
        }
    }
}
