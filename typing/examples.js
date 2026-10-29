// Additional practice snippets. These commands are displayed, never executed.
globalThis.extraLessons = {
  go: [
    {name:'맵으로 빈도 세기',file:'frequency.go',code:`func frequency(words []string) map[string]int {
    counts := make(map[string]int)
    for _, word := range words {
        counts[word]++
    }
    return counts
}`},
    {name:'switch 분기',file:'status.go',code:`func statusLabel(code int) string {
    switch code {
    case 200, 201:
        return "success"
    case 404:
        return "not found"
    default:
        return "unknown"
    }
}`},
    {name:'defer와 파일 읽기',file:'reader.go',code:`func readFile(path string) ([]byte, error) {
    file, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer file.Close()
    return io.ReadAll(file)
}`},
    {name:'인터페이스와 구현',file:'logger.go',code:`type Logger interface {
    Log(message string)
}

type ConsoleLogger struct{}

func (l ConsoleLogger) Log(message string) {
    fmt.Println(message)
}`},
    {name:'고루틴과 채널',file:'worker.go',code:`func double(input <-chan int, output chan<- int) {
    defer close(output)
    for value := range input {
        output <- value * 2
    }
}

func start(input <-chan int) <-chan int {
    output := make(chan int)
    go double(input, output)
    return output
}`},
    {name:'컨텍스트 취소',file:'context.go',code:`func wait(ctx context.Context) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    case <-time.After(time.Second):
        return nil
    }
}`},
    {name:'JSON 인코딩',file:'response.go',code:`type Response struct {
    Message string \`json:"message"\`
    Success bool   \`json:"success"\`
}

func encode() ([]byte, error) {
    result := Response{
        Message: "ready",
        Success: true,
    }
    return json.Marshal(result)
}`},
    {name:'HTTP 핸들러',file:'handler.go',code:`func health(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "status": "up",
    })
}`}
  ],
  spring: [
    {name:'요청 DTO 검증',file:'CreateUserRequest.java',code:`public record CreateUserRequest(
    @NotBlank String name,
    @Email String email,
    @Min(18) int age
) {}`},
    {name:'POST 요청 받기',file:'UserController.java',code:`@PostMapping("/users")
public ResponseEntity<User> create(
    @Valid @RequestBody CreateUserRequest request
) {
    User user = service.create(request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(user);
}`},
    {name:'페이지네이션',file:'UserController.java',code:`@GetMapping("/users")
public Page<User> findAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size
) {
    Pageable pageable = PageRequest.of(page, size);
    return repository.findAll(pageable);
}`},
    {name:'트랜잭션 업데이트',file:'UserService.java',code:`@Transactional
public void updateName(Long id, String name) {
    User user = repository.findById(id)
        .orElseThrow(() ->
            new IllegalArgumentException("User not found")
        );
    user.setName(name);
}`},
    {name:'전역 예외 처리',file:'GlobalExceptionHandler.java',code:`@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handle(
        IllegalArgumentException exception
    ) {
        return ResponseEntity.badRequest()
            .body(exception.getMessage());
    }
}`},
    {name:'Bean 설정',file:'ClockConfig.java',code:`@Configuration
public class ClockConfig {
    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }
}`},
    {name:'리포지토리 쿼리',file:'UserRepository.java',code:`public interface UserRepository
    extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("select u from User u where u.active = true")
    List<User> findActiveUsers();
}`},
    {name:'설정 속성 바인딩',file:'AppProperties.java',code:`@ConfigurationProperties(prefix = "app")
public record AppProperties(
    String name,
    Duration timeout,
    URI baseUrl
) {}`}
  ],
  vue: [
    {name:'watch로 변경 감지',file:'Search.vue',code:`<script setup>
import { ref, watch } from 'vue';

const query = ref('');
watch(query, (value, previous) => {
  console.log(previous, value);
});
</script>

<template>
  <input v-model="query" placeholder="Search" />
</template>`},
    {name:'마운트와 정리',file:'Timer.vue',code:`<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const seconds = ref(0);
let timer;
onMounted(() => {
  timer = setInterval(() => seconds.value++, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>{{ seconds }} seconds</template>`},
    {name:'기본값이 있는 Props',file:'Greeting.vue',code:`<script setup>
defineProps({
  name: { type: String, default: 'developer' },
  active: { type: Boolean, default: true },
});
</script>

<template>
  <p v-if="active">Hello, {{ name }}!</p>
</template>`},
    {name:'양방향 바인딩',file:'TextField.vue',code:`<script setup>
const model = defineModel({
  type: String,
  default: '',
});
</script>

<template>
  <input v-model.trim="model" />
  <span>{{ model.length }} characters</span>
</template>`},
    {name:'클래스와 스타일',file:'Status.vue',code:`<script setup>
import { ref } from 'vue';
const active = ref(false);
</script>

<template>
  <button
    :class="{ active }"
    :style="{ opacity: active ? 1 : 0.5 }"
    @click="active = !active"
  >Toggle</button>
</template>`},
    {name:'비동기 데이터 로딩',file:'Users.vue',code:`<script setup>
import { ref, onMounted } from 'vue';

const users = ref([]);
const error = ref('');
onMounted(async () => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Request failed');
    users.value = await response.json();
  } catch (exception) {
    error.value = exception.message;
  }
});
</script>`},
    {name:'재사용 Composable',file:'useCounter.js',code:`import { ref, computed } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  const doubled = computed(() => count.value * 2);
  const increment = () => count.value++;
  const reset = () => { count.value = initial; };

  return { count, doubled, increment, reset };
}`},
    {name:'폼 제출',file:'LoginForm.vue',code:`<script setup>
import { reactive } from 'vue';
const form = reactive({ email: '', password: '' });
const emit = defineEmits(['login']);
</script>

<template>
  <form @submit.prevent="emit('login', { ...form })">
    <input v-model="form.email" type="email" />
    <input v-model="form.password" type="password" />
    <button type="submit">Sign in</button>
  </form>
</template>`}
  ],
  git: [
    {name:'변경 내역 자세히',file:'git · diff',code:`git diff --stat
git diff --name-only
git diff main...feature/login
git show --stat HEAD`},
    {name:'커밋 이력 탐색',file:'git · history',code:`git log --graph --oneline --all
git log --author="developer"
git log -p -- README.md
git blame README.md`},
    {name:'작업 잠시 보관',file:'git · stash',code:`git stash push -m "work in progress"
git stash list
git stash show -p
git stash apply`},
    {name:'스테이징 다루기',file:'git · staging',code:`git add -p
git diff --cached
git restore --staged README.md
git status --short`},
    {name:'브랜치 비교',file:'git · branches',code:`git branch --all
git branch --show-current
git log main..feature/login --oneline
git diff main...feature/login --stat`},
    {name:'태그와 릴리스',file:'git · tags',code:`git tag --list
git tag -a v1.0.0 -m "First release"
git show v1.0.0
git push origin v1.0.0`},
    {name:'Worktree로 병렬 작업',file:'git · worktree',code:`git worktree list
git worktree add ../project-hotfix -b hotfix/login
git -C ../project-hotfix status
git worktree list --porcelain`},
    {name:'원격과 추적 브랜치',file:'git · tracking',code:`git remote show origin
git branch -vv
git fetch --all
git rev-parse --short HEAD
git status --branch --short`}
  ],
  docker: [
    {name:'포트와 상태 확인',file:'docker · status',code:`docker ps --format "table {{.Names}}\\t{{.Status}}"
docker port app
docker top app
docker inspect --format '{{.State.Status}}' app`},
    {name:'볼륨 기본',file:'docker · volumes',code:`docker volume ls
docker volume create app-data
docker volume inspect app-data
docker run -d --name cache -v app-data:/data redis:7`},
    {name:'컨테이너 네트워크',file:'docker · network',code:`docker network ls
docker network create app-net
docker network inspect app-net
docker network connect app-net app`},
    {name:'이미지 태그와 배포',file:'docker · images',code:`docker pull nginx:alpine
docker image inspect nginx:alpine
docker tag my-app:latest my-app:1.0.0
docker image history my-app:1.0.0`},
    {name:'로그와 이벤트',file:'docker · logs',code:`docker logs --timestamps --tail 100 app
docker logs --since 10m app
docker events --filter container=app
docker stats --no-stream`},
    {name:'실행 옵션',file:'docker · options',code:`docker run -d \\
  --name web \\
  --restart unless-stopped \\
  -p 8080:80 \\
  --memory 256m \\
  nginx:alpine`},
    {name:'Compose 서비스 관리',file:'docker · services',code:`docker compose config --services
docker compose up -d --build
docker compose logs --tail 50 web
docker compose exec web sh
docker compose restart web`},
    {name:'Dockerfile 작성',file:'Dockerfile',code:`FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]`}
  ],
  linux: [
    {name:'파일 내용 탐색',file:'linux · reading',code:`less app.log
tail -n 50 app.log
head -n 10 config.yml
wc -l app.log
file README.md`},
    {name:'검색 조건 조합',file:'linux · find',code:`find ./src -type f -name "*.go"
find ./logs -type f -mtime -7
grep -rn "TODO" ./src
grep -i "warning" app.log`},
    {name:'정렬과 집계',file:'linux · pipes',code:`cat access.log | sort | uniq -c
grep "ERROR" app.log | wc -l
cut -d ',' -f 1 users.csv | sort -u
du -sh ./logs`},
    {name:'권한 확인과 변경',file:'linux · permissions',code:`ls -l deploy.sh
chmod u+x deploy.sh
stat deploy.sh
id
umask`},
    {name:'압축과 목록 확인',file:'linux · archive',code:`tar -czf source.tar.gz ./src
tar -tzf source.tar.gz
gzip -k app.log
gzip -l app.log.gz`},
    {name:'HTTP 요청 확인',file:'linux · curl',code:`curl -I https://example.com
curl -sS http://localhost:8080/health
curl -o response.json http://localhost:8080/api/users
curl --connect-timeout 5 https://example.com`},
    {name:'환경과 실행 경로',file:'linux · environment',code:`printenv PATH
export APP_ENV=development
printf '%s\\n' "$APP_ENV"
command -v docker
which git`},
    {name:'프로세스와 시스템 로그',file:'linux · processes',code:`ps -eo pid,comm,%mem --sort=-%mem
pgrep -a java
uptime
journalctl -u nginx -n 30 --no-pager
systemctl status nginx`}
  ]
};
