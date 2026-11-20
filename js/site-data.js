/**
 * 个人网站与智能简历核心数据源
 * 整合：电子科技大学本科 -> 港中深硕士 -> 港中深表情机器人研助 -> 科大讯飞运营技术支持 -> 核心项目与产品实践
 */
window.DEFAULT_SITE_DATA = {
  profile: {
    name: "赵铖城",
    nameEn: "Chengcheng Zhao",
    title: "AI / 消费电子 / 机器人产品经理",
    subTitle: "通信工程背景 × 软硬件研发协同 × AI 评测与落地实践",
    avatar: "assets/images/avatar.jpg",
    statusBadge: "🟢 寻找日常/长期实习 · 随时到岗",
    location: "深圳 / 广州 / 北京",
    phone: "153-7819-8229",
    email: "zhaochengcheng2004@163.com",
    github: "https://github.com/laid966",
    linkedin: "https://www.linkedin.com/in/laid966", // 可在后台修改
    bioParagraphs: [
      "懂硬件的工程背景，正在用工程师的方法做 AI 产品。",
      "本科毕业于电子科技大学通信工程，硕士就读于香港中文大学（深圳）通信工程。具备扎实的通信、嵌入式软硬件底层研发与 ROS2 机器人开发功底，同时具备敏锐的产品用户洞察、系统级架构规划与端云协同落地能力。",
      "曾在高校顶尖表情机器人团队担任研究助理，主导高拟人化仿生面部伺服控制与边缘端 AI 模型部署（Audio2Face 转 RKNN）；在科大讯飞负责企业级网络基础设施的产品化运营，具备跨部门沟通、指标量化与商业降本思维。熟练运用 Prompt 工程、RAG、Agent 护栏与真实评测方法论推进大模型产品化落地。"
    ],
    highlights: [
      { label: "最高学历", value: "港中深 硕士在读" },
      { label: "本硕专业", value: "通信工程（双一流/港中深）" },
      { label: "研发与业务实习", value: "3 段（韶音 / 港中深 / 讯飞）" },
      { label: "软硬件与AI代表作", value: "5+ 项从0到1完整实践" }
    ]
  },
  education: [
    {
      id: "edu-cuhksz",
      institution: "香港中文大学（深圳）",
      degree: "硕士在读 · 通信工程",
      period: "2026.09 - 2028.06",
      location: "深圳",
      logo: "assets/images/cuhksz_logo_official.png",
      gpa: "",
      courses: "随机过程、数据分析（CIE6006/MCE5918）、机器人先进感知与控制",
      highlights: [
        "专注于机器人感知控制、端侧轻量化模型部署与多智能体协同系统研究",
        "入选港中深高拟人表情机器人前沿课题组并担任研究助理"
      ]
    },
    {
      id: "edu-uestc",
      institution: "电子科技大学",
      degree: "工学学士 · 通信工程",
      period: "2022.08 - 2026.06",
      location: "成都",
      logo: "assets/images/uestc_logo_official.png",
      courses: "信号与系统、电磁场与波、随机信号分析、数字信号处理、微机原理",
      highlights: [
        "荣誉奖项：全国大学生数学竞赛 省级二等奖",
        "荣誉奖项：全国大学生数学建模竞赛 省级三等奖",
        "学生工作：担任学院核心学生工作职务，处理学生行政与大型社团活动组织统筹"
      ]
    }
  ],
  experience: [
    {
      id: "exp-shokz",
      role: "AI 产品实习生",
      company: "韶音科技 (Shokz)",
      period: "2026 - 至今",
      location: "深圳",
      tag: "AI 产品 / 消费电子 / 开放式耳机",
      summary: "（本段经历为预留位置：具体职责与量化成果待补充，可在后台 /admin.html 直接编辑本卡片后保存。）",
      responsibilities: [
        "待补充：参与开放式耳机端侧 AI 功能（语音助手 / AI 通话体验 / 内容生成）的需求定义与体验评测；",
        "待补充：搭建竞品 AI 功能对标与评测集（已沉淀韶音 OpenFit 2 AI 竞品分析报告）；",
        "待补充：协同算法与硬件团队推进端侧 AI 能力落地、体验指标与成本优化。"
      ]
    },
    {
      id: "exp-cuhksz-robot",
      role: "研究助理（硬件电控负责人 & 产品推进）",
      company: "香港中文大学（深圳）— 表情机器人团队",
      period: "2026.04 - 2026.09",
      location: "深圳",
      tag: "机器人 / 边缘AI / 软硬协同",
      summary: "主导高拟人化面部表情机器人电控架构设计与边缘 AI 模型部署，聚焦微表情高保真复现与自然交互体验落地。",
      responsibilities: [
        "产品规划与方案定义：针对陪伴与教育场景，主导高拟人表情机器人产品技术方案，从0到1拆解多自由度面部微表情关节映射逻辑，明确机械、电控与算法边界，编写完整的软硬件接口规范与交互需求文档。",
        "跨部门协同推进：联动算法团队（Landmark 关键点检测、BlendShape 权重）、结构团队与嵌入式电控团队，统筹制定 ROS2 与 Micro-ROS 通信链路标准，打通上位机音频推流与底层舵机控制数据流。",
        "端侧轻量化部署与降本：调度 OrangePi 5 Plus (RK3588 NPU) 进行模型轻量化，在 Agent 辅助下将 Audio2Face 模型转为 ONNX 并量化为 INT8 RKNN 离线模型，彻底摆脱云端 API 依赖，降低整机 BOM 成本与功耗，开发迭代周期缩短约 50%。",
        "体验与延时指标优化：在 ESP32-P4 平台基于 FreeRTOS 编写控制任务反馈机制，实现眨眼、嘴角微动等高保真表情输出，端到端交互延迟达到无感水平。"
      ]
    },
    {
      id: "exp-iflytek",
      role: "运营技术支持实习生",
      company: "科大讯飞北京公司",
      period: "2024.12 - 2025.02",
      location: "北京",
      tag: "需求调研 / 数字化运营 / 降本增效",
      summary: "负责企业弱电网络、智慧会议系统及内部基础设施的产品化运营，作为业务方代表推动内部系统迭代与流程标准化。",
      responsibilities: [
        "业务需求调研与流程设计：主导内部停车场分配管理系统需求文档（PRD）设计，调研多方诉求与资源瓶颈，梳理权限规则与业务流，推动内部资源分配从繁琐人工协调转变为系统化线上标准化管理。",
        "网络架构优化与降本增效：牵头物业、三大运营商及弱电施工方的多方资源比选与网络带宽规划，完成园区网络链路优化，累计为企业节省年网络开支十余万元。",
        "故障分级闭环与项目管理：建立高频网络与会议系统故障跟踪与闭环管理机制，输出标准化故障处置操作手册与验收清单模板，推动高频故障平均处理时长缩短约 40%。"
      ]
    }
  ],
  projects: [
    {
      id: "proj-m1-eval",
      title: "硬件端 AI 问答模型与 Prompt 评测体系",
      category: "ai-pm",
      subtitle: "30 题 Golden Set × 3 版 Prompt × 双模型，建立“质量-体验-成本”三维评测与失败归因",
      period: "2026.11",
      role: "AI 产品经理 / 评测架构设计",
      tags: ["AI PM", "Golden Set", "Prompt Eval", "Cost Ledger"],
      problem: "硬件消费电子产品上线 AI 问答功能时，选模型、调 Prompt 往往缺乏客观量化手段，容易出现幻觉、谄媚以及 Token 成本失控问题。",
      solution: "自建 30 题评测 Golden Set（含 15 常规题、9 边界题、6 超纲对抗题），设计 v1_minimal、v2_evidence、v3_reasoning 三版渐进式 Prompt，对比 DeepSeek 与 Qwen 两款主流模型，输出结构化 {answer, evidence, confidence}，建立质量、首字延迟与 Token 成本的定量监控账本。",
      outcome: "沉淀可复用的模型选型与 Prompt 迭代评测体系，形成系统性的失败归因与拒答护栏规则，将错误回答率显著降低并可控核算调用成本。"
    },
    {
      id: "proj-agent-core",
      title: "Agent 核心调度机制与主流框架架构实战",
      category: "ai-pm",
      subtitle: "深入 ReAct 范式、Tool Calling、上下文隔离与 Cordis 插件化 Agent 架构",
      period: "2026.09 - 2026.11",
      role: "Agent 架构探索与开发者",
      tags: ["Agent", "ReAct", "Tool Registry", "Context Engineering"],
      problem: "大语言模型如何稳定调用复杂外部工具，并应对超长上下文窗口裁剪与任务中断异常。",
      solution: "深度研习 Agent 核心调度器原理，独立封装上下文裁剪与执行隔离模块；基于 Hello-Agents 教程设计统一工具调用接口（Tool Registry）与 Session 会话存储；探索基于 Cordis 插件体系的“一切皆插件”Agent 运行时机制。",
      outcome: "完成了从需求梳理、Tool Schema 定义、多步任务规划到异常重试兜底的闭环设计，为后续构建带护栏的业务 Agent 周报系统打下坚实底层支撑。"
    },
    {
      id: "proj-linkus",
      title: "Linkus 校园地图与即时社交 App 产品设计",
      category: "product-design",
      subtitle: "从 0 到 1 打造融合室内外导航与 LBS 社交的校园全场景产品原型",
      period: "2026.07 - 2026.09",
      role: "产品负责人 / UI/UX 设计",
      tags: ["Figma", "LBS", "产品原型", "用户路径"],
      problem: "大学校园场景下通用地图软件缺乏教学楼内精细化导航与校园人脉关系链，“找教室”与“找校友”互相割裂，新生适应成本极高。",
      solution: "从需求调研出发，梳理核心功能架构与“位置查询→路线导航→到点打卡/社交”全路径闭环。在 Figma 中搭建完整高保真可交互原型与设计规范系统，支持快捷登录、位置筛选与活动圈子聚合。",
      outcome: "交付全套产品 PRD 与交互原型组件库，该套 LBS 设计方案可直接复用于大型科技园区、展会导航等商用场景。"
    },
    {
      id: "proj-uav",
      title: "多旋翼无人机机器视觉自主循迹与飞行控制系统",
      category: "hardware",
      subtitle: "在无 GPS 环境下基于视觉解算与 PX4 飞控实现稳定自主航线闭环",
      period: "2025.10 - 2026.04",
      role: "项目负责人 / 嵌入式与飞控调试",
      tags: ["PX4 飞控", "STM32", "OpenMV", "机器视觉", "C++"],
      problem: "无人机在室内、连廊或建筑群等 GPS 强遮挡场景下无法依赖卫星导航，导致自主飞行与自动化巡检无法作业。",
      solution: "设计“视觉感知 → 串口通信 → 飞控闭环”系统链路：以 OpenMV 实时捕获地面特定路标并通过色块算法解算相对坐标，使用 STM32 单片机完成数据封包并转化为 PX4 飞控位置环控制指令。",
      outcome: "完成整机装配与户外实飞调试，在无 GPS 信号环境下成功实现高精度轨迹跟踪飞行，形成一套可复用于室内巡检的视觉导航方案。"
    },
    {
      id: "proj-tdoa",
      title: "多无人机协同城市无源目标定位算法仿真",
      category: "hardware",
      subtitle: "基于 TDOA+AOA 联合观测与 IMM-UKF 滤波算法抑制 NLOS 遮挡误差",
      period: "2025.03 - 2025.07",
      role: "算法研究与仿真实现",
      tags: ["MATLAB", "IMM-UKF", "蒙特卡洛仿真", "算法验证"],
      problem: "城市建筑密集区域多径效应严重，单无人机定位时易因非视距（NLOS）遮挡发生严重发散。",
      solution: "建立多机协同的到达时间差（TDOA）与到达角（AOA）联合观测方程，引入交互式多模型无迹卡尔曼滤波（IMM-UKF），自适应判别视距与遮挡状态。",
      outcome: "在 MATLAB 中构建万次蒙特卡洛仿真实验，定位均方根误差（RMSE）大幅下降，为复杂城市场景下的目标搜寻提供了理论与算法验证。"
    }
  ],
  skills: [
    {
      category: "产品经理核心能力",
      items: [
        { name: "需求洞察与分析", level: "熟练" },
        { name: "产品规划与 PRD 撰写", level: "精通" },
        { name: "Figma 高保真交互原型与组件库", level: "精通" },
        { name: "竞品全景拆解与商业模式分析", level: "熟练" },
        { name: "用户旅程地图 (User Journey Map)", level: "精通" }
      ]
    },
    {
      category: "AI 与评测方法论",
      items: [
        { name: "Golden Set 评测集构建", level: "精通" },
        { name: "Prompt 工程与边界护栏设计", level: "精通" },
        { name: "RAG 检索增强架构与 Chunking 调优", level: "熟练" },
        { name: "Agent ReAct 调度与工具协议", level: "熟练" },
        { name: "LLM 成本与调用性能监控", level: "熟练" }
      ]
    },
    {
      category: "软硬件工程与开发",
      items: [
        { name: "ROS2 & Micro-ROS 机器人通信", level: "精通" },
        { name: "STM32 / ESP32 嵌入式单片机与 FreeRTOS", level: "精通" },
        { name: "Audio2Face / ONNX 转 RKNN (NPU 部署)", level: "熟练" },
        { name: "Python / C++ / MATLAB", level: "精通" },
        { name: "Git / GitHub Actions 协同", level: "熟练" }
      ]
    },
    {
      category: "语言与通用资质",
      items: [
        { name: "雅思 (IELTS) 6.5（流畅阅读英文技术文档）", level: "良好" },
        { name: "全国大学生数学竞赛 省二等奖", level: "省级" },
        { name: "全国大学生数学建模竞赛 省三等奖", level: "省级" }
      ]
    }
  ],
  socials: {
    github: "https://github.com/laid966",
    linkedin: "https://www.linkedin.com/in/laid966",
    email: "zhaochengcheng2004@163.com",
    phone: "15378198229",
    wechat: "laid966"
  }
};
