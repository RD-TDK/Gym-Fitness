//package com.myfitnessapp.trainingappointment;
//
//import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
//import com.myfitnessapp.service.exception.InvalidBusinessRuleException;
//import com.myfitnessapp.service.request.mapper.TrainingRequestMapper;
//import com.myfitnessapp.service.request.model.TrainingRequest;
//import com.myfitnessapp.service.request.service.TrainingRequestService;
//import com.myfitnessapp.service.session.event.SessionUpdatedEvent;
//import com.myfitnessapp.service.session.mapper.SessionInfoMapper;
//import com.myfitnessapp.service.session.model.SessionInfo;
//import com.myfitnessapp.service.session.service.SessionInfoService;
//import com.myfitnessapp.service.exception.ResourceNotFoundException;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//
//import org.mockito.ArgumentCaptor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//
//import org.springframework.context.ApplicationContext;
//import org.springframework.context.ApplicationEventPublisher;
//import org.springframework.context.ApplicationListener;
//import org.springframework.context.ConfigurableApplicationContext;
//import org.springframework.test.context.event.ApplicationEvents;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Collections;
//import java.util.List;
//
//import static org.assertj.core.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.BDDMockito.*;
//
//@SpringBootTest
//@Transactional
//class TrainingAppointmentApplicationTests {
//
//    @Autowired
//    private SessionInfoService sessionInfoService;
//
//    @Autowired
//    private TrainingRequestService trainingRequestService;
//
//    @Autowired
//    private ConfigurableApplicationContext ctx;
//
//    @MockBean
//    private SessionInfoMapper sessionInfoMapper;
//
//    @MockBean
//    private TrainingRequestMapper trainingRequestMapper;
//
//    @MockBean
//    private ApplicationEventPublisher eventPublisher;
//
//    // 测试用的事件收集器
//    private final List<SessionUpdatedEvent> captured = new ArrayList<>();
//
//    @BeforeEach
//    void setUp() {
//        // 清理所有 stub 行为
//        reset(sessionInfoMapper, trainingRequestMapper,eventPublisher);
//        captured.clear();
//        ctx.addApplicationListener((ApplicationListener<SessionUpdatedEvent>) captured::add);
//    }
//
//    @Test
//    void contextLoads() {
//    }
//
//    @Test
//    void testCreateCourse_success_and_conflict() {
//        SessionInfo input = new SessionInfo();
//        input.setTrainerId(1);
//        input.setCenterId(2);
//        input.setSessionDatetime(LocalDateTime.now().plusDays(1));
//        input.setDuration(60);
//        input.setPrice(new BigDecimal("100"));
//
//        // 1) 无冲突时插入
//        given(sessionInfoMapper.selectList(any())).willReturn(Collections.<SessionInfo>emptyList());
//        willAnswer(inv -> {
//            SessionInfo arg = inv.getArgument(0);
//            arg.setSessionId(123);
//            return 1;
//        }).given(sessionInfoMapper).insert(input);
//
//        SessionInfo created = sessionInfoService.createCourse(input);
//        assertThat(created.getSessionId()).isEqualTo(123);
//        assertThat(created.getStatus()).isEqualTo("ACTIVE");
//        then(sessionInfoMapper).should().insert(input);
//
//        // 2) 有冲突，抛异常
//        given(sessionInfoMapper.selectList(any())).willReturn(Collections.singletonList(new SessionInfo()));
//        SessionInfo conflict = new SessionInfo();
//        conflict.setTrainerId(1);
//        conflict.setCenterId(2);
//        conflict.setSessionDatetime(input.getSessionDatetime());
//
//        assertThatThrownBy(() -> sessionInfoService.createCourse(conflict))
//                .isInstanceOf(InvalidBusinessRuleException.class)
//                .hasMessageContaining("此时段您已发布过课程");
//    }
//
//    @Test
//    void testDeleteCourse_success_and_noPermission() {
//        SessionInfo s = new SessionInfo();
//        s.setSessionId(5);
//        s.setTrainerId(10);
//
//        // 成功删除
//        given(sessionInfoMapper.selectById(5)).willReturn(s);
//        given(sessionInfoMapper.updateById(s)).willReturn(1);
//        boolean ok = sessionInfoService.deleteCourse(5, 10);
//        assertThat(ok).isTrue();
//
//        // 无权限或不存在
//        given(sessionInfoMapper.selectById(6)).willReturn(null);
//        assertThatThrownBy(() -> sessionInfoService.deleteCourse(6, 10))
//                .isInstanceOf(ResourceNotFoundException.class);
//    }
//
//    @Test
//    void testFindAndGetByMember() {
//        SessionInfo s = new SessionInfo();
//        given(sessionInfoMapper.selectList(any())).willReturn(Collections.singletonList(s));
//
//        List<SessionInfo> list1 = sessionInfoService.findCourses(
//                LocalDateTime.now(), LocalDateTime.now().plusDays(1));
//        assertThat(list1).containsExactly(s);
//
//        List<SessionInfo> list2 = sessionInfoService.getSessionsByMember(20);
//        assertThat(list2).containsExactly(s);
//    }
//
//    @Test
//    void testUpdateSessionRecord_success_and_errors() {
//        // —— 场景1：正常更新并发布事件 ——
//        SessionInfo s = new SessionInfo();
//        s.setSessionId(7);
//        // selectById(7) 返回 s
//        given(sessionInfoMapper.selectById(7)).willReturn(s);
//        // updateById(s) 返回 1 表示更新成功
//        given(sessionInfoMapper.updateById(s)).willReturn(1);
//
//        // 调用业务
//        boolean ok = sessionInfoService.updateSessionRecord(
//                7,
//                45,
//                LocalDateTime.now().plusHours(2),
//                "COMPLETED"
//        );
//        assertThat(ok).isTrue();
//
//        // 验证事件发布
//        assertThat(captured).hasSize(1);
//        assertThat(captured.get(0).getSessionInfo().getSessionId()).isEqualTo(7);
//
//        // —— 场景2：ID 不存在，应抛 ResourceNotFoundException ——
//        // selectById(8) 返回 null
//        given(sessionInfoMapper.selectById(8)).willReturn(null);
//        assertThatThrownBy(() ->
//                sessionInfoService.updateSessionRecord(8, 30, null, "COMPLETED")
//        ).isInstanceOf(ResourceNotFoundException.class);
//
//        // —— 场景3：下次课程时间太近，应抛 InvalidBusinessRuleException ——
//        SessionInfo s2 = new SessionInfo();
//        s2.setSessionId(9);
//        // selectById(9) 返回 s2
//        given(sessionInfoMapper.selectById(9)).willReturn(s2);
//
//        LocalDateTime tooSoon = LocalDateTime.now().plusMinutes(30);
//        assertThatThrownBy(() ->
//                sessionInfoService.updateSessionRecord(9, 30, tooSoon, "COMPLETED")
//        ).isInstanceOf(InvalidBusinessRuleException.class)
//                .hasMessageContaining("下次训练时间必须至少在 1 小时后");
//    }
//
//    @Test
//    void testCancelSession_andTotalDuration() {
//        SessionInfo s = new SessionInfo();
//        given(sessionInfoMapper.selectById(11)).willReturn(s);
//        given(sessionInfoMapper.updateById(s)).willReturn(1);
//        boolean cancelled = sessionInfoService.cancelSession(11);
//        assertThat(cancelled).isTrue();
//
//        // 不存在时
//        given(sessionInfoMapper.selectById(12)).willReturn(null);
//        assertThatThrownBy(() -> sessionInfoService.cancelSession(12))
//                .isInstanceOf(ResourceNotFoundException.class);
//
//        // 总时长统计
//        given(sessionInfoMapper.selectObjs(any()))
//                .willReturn(Arrays.asList(10, null, 20));
//        int total = sessionInfoService.getTotalDuration(30,
//                LocalDateTime.now().minusDays(1), LocalDateTime.now());
//        assertThat(total).isEqualTo(30);
//    }
//
//    @Test
//    void testCreateRequest_allScenarios() {
//        // 1) 课程不存在 -> ResourceNotFoundException
//        given(sessionInfoMapper.selectById(100)).willReturn(null);
//        assertThatThrownBy(() ->
//                trainingRequestService.createRequest(100, 50)
//        ).isInstanceOf(ResourceNotFoundException.class)
//                .hasMessageContaining("课程不存在");
//
//        // ====== 以下三个场景都针对 sessionId = 1 ======
//        SessionInfo target = new SessionInfo();
//        LocalDateTime dt = LocalDateTime.of(2025, 1, 1, 9, 0);
//        target.setSessionDatetime(dt);
//        // 每次都先返回这节课
//        given(sessionInfoMapper.selectById(1)).willReturn(target);
//
//        // 2) 时间冲突：approved 列表非空 -> InvalidBusinessRuleException
//        TrainingRequest approvedRequest = new TrainingRequest();
//        approvedRequest.setSessionId(2);
//        approvedRequest.setMemberId(50);
//        // 第一次调用 selectList(any()) 返回“已批准”列表
//        given(trainingRequestMapper.selectList(any()))
//                .willReturn(Collections.singletonList(approvedRequest));
//        given(sessionInfoMapper.selectById(2)).willReturn(target);
//        assertThatThrownBy(() ->
//                trainingRequestService.createRequest(1, 50)
//        ).isInstanceOf(InvalidBusinessRuleException.class)
//                .hasMessageContaining("时间冲突");
//
//        // 3) 重复请求：第一次查 approved 返回空，第二次查 duplicate 返回非空
//        reset(trainingRequestMapper);
//        // stub 两次 selectList：第一次空列表，第二次 singletonList -> 触发“重复发起”异常
//        given(sessionInfoMapper.selectById(1)).willReturn(target);
//        given(trainingRequestMapper.selectList(any()))
//                .willReturn(Collections.emptyList(), Collections.singletonList(new TrainingRequest()));
//        assertThatThrownBy(() ->
//                trainingRequestService.createRequest(1, 50)
//        ).isInstanceOf(InvalidBusinessRuleException.class)
//                .hasMessageContaining("已对该课程发起过请求");
//
//        // 4) 成功发起：两次查询均返回空，insert 时给出一个假的 requestId
//        reset(trainingRequestMapper);
//        given(sessionInfoMapper.selectById(1)).willReturn(target);
//        given(trainingRequestMapper.selectList(any()))
//                .willReturn(Collections.emptyList());
//        willAnswer(invocation -> {
//            TrainingRequest arg = invocation.getArgument(0);
//            arg.setRequestId(999);
//            return 1;
//        }).given(trainingRequestMapper).insert(any(TrainingRequest.class));
//
//        TrainingRequest created = trainingRequestService.createRequest(1, 50);
//        // 验证返回的 requestId 和默认状态
//        assertThat(created.getRequestId()).isEqualTo(999);
//        assertThat(created.getStatus()).isEqualTo("PENDING");
//    }
//
//    @Test
//    void testFindRequests_simple() {
//        TrainingRequest r = new TrainingRequest();
//        given(trainingRequestMapper.selectList(any())).willReturn(Collections.singletonList(r));
//        List<TrainingRequest> list = trainingRequestService.findRequests(10);
//        assertThat(list).containsExactly(r);
//    }
//
//    @Test
//    void testReviewRequest_allScenarios() {
//        LocalDateTime dt = LocalDateTime.of(2025,1,1,9,0);
//
//        // 1) 请求不存在
//        given(trainingRequestMapper.selectById(200)).willReturn(null);
//        assertThatThrownBy(() ->
//                trainingRequestService.reviewRequest(200, "APPROVED", null))
//                .isInstanceOf(ResourceNotFoundException.class);
//
//        // 2) 已处理
//        TrainingRequest r2 = new TrainingRequest();
//        r2.setStatus("APPROVED");
//        given(trainingRequestMapper.selectById(201)).willReturn(r2);
//        assertThatThrownBy(() ->
//                trainingRequestService.reviewRequest(201, "REJECTED", "x"))
//                .isInstanceOf(InvalidBusinessRuleException.class);
//
//        // 3) 批准时冲突
//        reset(trainingRequestMapper);
//        TrainingRequest r3 = new TrainingRequest();
//        r3.setStatus("PENDING");
//        r3.setSessionId(3);
//        r3.setMemberId(60);
//        given(trainingRequestMapper.selectById(202)).willReturn(r3);
//
//        SessionInfo t3 = new SessionInfo();
//        t3.setSessionDatetime(dt);
//        given(sessionInfoMapper.selectById(3)).willReturn(t3);
//        // 「所有针对 APPROVED 的查询」都返回一个冲突请求
//        given(trainingRequestMapper.selectList(any(QueryWrapper.class)))
//                .willReturn(Collections.singletonList(
//                        new TrainingRequest(){{
//                            setSessionId(4);
//                            setMemberId(60);
//                        }}
//                ));
//        given(sessionInfoMapper.selectById(4)).willReturn(t3);
//
//        assertThatThrownBy(() ->
//                trainingRequestService.reviewRequest(202, "APPROVED", null))
//                .isInstanceOf(InvalidBusinessRuleException.class);
//
//        // 4) 拒绝成功
//        reset(trainingRequestMapper);
//        TrainingRequest r4 = new TrainingRequest();
//        r4.setStatus("PENDING");
//        given(trainingRequestMapper.selectById(203)).willReturn(r4);
//        given(trainingRequestMapper.updateById(r4)).willReturn(1);
//
//        TrainingRequest outR4 = trainingRequestService.reviewRequest(
//                203, "REJECTED", "no");
//        assertThat(outR4.getStatus()).isEqualTo("REJECTED");
//        assertThat(outR4.getReason()).isEqualTo("no");
//
//        // 5) 批准成功
//        reset(trainingRequestMapper);
//        TrainingRequest r5 = new TrainingRequest();
//        r5.setStatus("PENDING");
//        r5.setSessionId(5);
//        r5.setMemberId(70);
//        given(trainingRequestMapper.selectById(204)).willReturn(r5);
//        // 审核冲突检查：永远返回空
//        given(trainingRequestMapper.selectList(any(QueryWrapper.class)))
//                .willReturn(Collections.emptyList());
//        given(sessionInfoMapper.selectById(5)).willReturn(new SessionInfo());
//        given(trainingRequestMapper.updateById(r5)).willReturn(1);
//
//        TrainingRequest outR5 = trainingRequestService.reviewRequest(
//                204, "APPROVED", null);
//        assertThat(outR5.getStatus()).isEqualTo("APPROVED");
//    }
//}
