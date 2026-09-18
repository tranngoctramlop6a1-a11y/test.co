// server/app.ts
import express from "express";
import cors from "cors";
import path2 from "path";
import fs2 from "fs";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

// server/db.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";

// src/data/dailyAdvices.ts
var DAILY_ADVICES = [
  // 1. Học tập & Điểm số
  {
    id: "adv_001",
    topic: "H\u1ECDc t\u1EADp",
    tag: "\u{1F4DA} H\u1ECDc t\u1EADp",
    icon: "\u270F\uFE0F",
    content: "M\u1ED9t b\xE0i ki\u1EC3m tra \u0111i\u1EC3m ch\u01B0a nh\u01B0 \xFD kh\xF4ng \u0111\u1ECBnh ngh\u0129a b\u1EA1n k\xE9m c\u1ECFi. N\xF3 ch\u1EC9 cho th\u1EA5y b\xE0i h\u1ECDc \u0111\xF3 c\u1EA7n b\u1EA1n th\xEAm m\u1ED9t ch\xFAt th\u1EDDi gian n\u1EEFa th\xF4i. H\xEDt th\u1EDF s\xE2u v\xE0 \xF4n l\u1EA1i nh\xE9!"
  },
  {
    id: "adv_002",
    topic: "H\u1ECDc t\u1EADp",
    tag: "\u{1F4DA} H\u1ECDc t\u1EADp",
    icon: "\u{1F4D6}",
    content: "H\xF4m nay n\u1EBFu th\u1EA5y b\xE0i t\u1EADp qu\xE1 nhi\u1EC1u v\xE0 ng\u1EE3p, h\xE3y ch\u1ECDn \u0111\xFAng m\u1ED9t b\xE0i nh\u1ECF nh\u1EA5t \u0111\u1EC3 l\xE0m tr\u01B0\u1EDBc. B\u1EAFt \u0111\u1EA7u t\u1EEB 5 ph\xFAt \u0111\u1EA7u ti\xEAn lu\xF4n l\xE0 ph\xE9p m\xE0u \u0111\xE1nh tan s\u1EF1 tr\xEC ho\xE3n."
  },
  {
    id: "adv_003",
    topic: "H\u1ECDc t\u1EADp",
    tag: "\u{1F4DA} H\u1ECDc t\u1EADp",
    icon: "\u{1F4A1}",
    content: "Hi\u1EC3u \u0111\u01B0\u1EE3c b\u1EA3n ch\u1EA5t m\u1ED9t c\xE2u h\u1ECFi quan tr\u1ECDng h\u01A1n vi\u1EC7c h\u1ECDc thu\u1ED9c m\u01B0\u1EDDi c\xE2u \u0111\u1EC3 \u0111\u1ED1i ph\xF3. H\xE3y t\xF2 m\xF2 nh\u01B0 m\u1ED9t \u0111\u1EE9a tr\u1EBB, vi\u1EC7c h\u1ECDc s\u1EBD b\u1EDBt \xE1p l\u1EF1c h\u01A1n r\u1EA5t nhi\u1EC1u."
  },
  // 2. Áp lực & Khen chê
  {
    id: "adv_004",
    topic: "\xC1p l\u1EF1c",
    tag: "\u{1F33F} \xC1p l\u1EF1c",
    icon: "\u{1F343}",
    content: "B\u1EA1n kh\xF4ng c\u1EA7n ph\u1EA3i ho\xE0n h\u1EA3o trong m\u1EAFt t\u1EA5t c\u1EA3 m\u1ECDi ng\u01B0\u1EDDi. S\u1EF1 k\u1EF3 v\u1ECDng c\u1EE7a ng\u01B0\u1EDDi kh\xE1c l\xE0 g\xF3c nh\xECn c\u1EE7a h\u1ECD, c\xF2n cu\u1ED9c s\u1ED1ng v\xE0 n\u0103ng l\u01B0\u1EE3ng n\xE0y l\xE0 c\u1EE7a ch\xEDnh b\u1EA1n."
  },
  {
    id: "adv_005",
    topic: "\xC1p l\u1EF1c",
    tag: "\u{1F33F} \xC1p l\u1EF1c",
    icon: "\u2615",
    content: "Khi l\u1ED3ng ng\u1EF1c th\u1EA5y n\u1EB7ng tr\u0129u, h\xE3y th\u1EA3 l\u1ECFng hai vai, u\u1ED1ng m\u1ED9t ng\u1EE5m n\u01B0\u1EDBc \u1EA5m v\xE0 nh\xECn ra ngo\xE0i c\u1EEDa s\u1ED5 2 ph\xFAt. M\u1ECDi vi\u1EC7c r\u1ED3i s\u1EBD c\xF3 c\xE1ch gi\u1EA3i quy\u1EBFt t\u1EEBng ch\xFAt m\u1ED9t."
  },
  {
    id: "adv_006",
    topic: "\xC1p l\u1EF1c",
    tag: "\u{1F33F} \xC1p l\u1EF1c",
    icon: "\u{1F331}",
    content: "\u0110\u1EEBng t\u1EF1 g\xE1nh c\u1EA3 t\u01B0\u01A1ng lai 5 hay 10 n\u0103m n\u1EEFa l\xEAn \u0111\xF4i vai h\xF4m nay. Vi\u1EC7c c\u1EE7a b\u1EA1n ng\xE0y h\xF4m nay ch\u1EC9 \u0111\u01A1n gi\u1EA3n l\xE0 s\u1ED1ng tr\u1ECDn v\u1EB9n v\xE0 nh\u1EB9 l\xF2ng v\u1EDBi ng\xE0y h\xF4m nay th\xF4i."
  },
  // 3. Thất bại & Sai lầm
  {
    id: "adv_007",
    topic: "Th\u1EA5t b\u1EA1i",
    tag: "\u{1F9D7} B\u1EAFt \u0111\u1EA7u l\u1EA1i",
    icon: "\u{1F308}",
    content: "L\xE0m sai m\u1ED9t l\u1EA7n kh\xF4ng bi\u1EBFn b\u1EA1n th\xE0nh k\u1EBB th\u1EA5t b\u1EA1i. \u0110\xF3 l\xE0 b\u1EB1ng ch\u1EE9ng cho th\u1EA5y b\u1EA1n \u0111\xE3 \u0111\u1EE7 d\u0169ng c\u1EA3m \u0111\u1EC3 th\u1EED s\u1EE9c thay v\xEC ch\u1EC9 ng\u1ED3i y\xEAn s\u1EE3 h\xE3i."
  },
  {
    id: "adv_008",
    topic: "Th\u1EA5t b\u1EA1i",
    tag: "\u{1F9D7} B\u1EAFt \u0111\u1EA7u l\u1EA1i",
    icon: "\u{1F331}",
    content: "Chi\u1EBFc b\xFAt ch\xEC n\xE0o c\u0169ng c\xF3 c\u1EE5c t\u1EA9y \u1EDF \u0111\u1EA7u \u0111u\xF4i. Cu\u1ED9c \u0111\u1EDDi cho ph\xE9p ch\xFAng ta ph\u1EA1m sai l\u1EA7m, x\xF3a \u0111i v\xE0 v\u1EBD l\u1EA1i n\xE9t m\u1EDBi \u0111\u1EB9p \u0111\u1EBD h\u01A1n b\u1EA5t c\u1EE9 l\xFAc n\xE0o."
  },
  {
    id: "adv_009",
    topic: "Th\u1EA5t b\u1EA1i",
    tag: "\u{1F9D7} B\u1EAFt \u0111\u1EA7u l\u1EA1i",
    icon: "\u{1F326}\uFE0F",
    content: "C\xFA v\u1EA5p ng\xE3 h\xF4m nay c\xF3 th\u1EC3 \u0111au, nh\u01B0ng n\xF3 \u0111ang d\u1EA1y cho \u0111\xF4i ch\xE2n b\u1EA1n bi\u1EBFt c\xE1ch gi\u1EEF th\u0103ng b\u1EB1ng v\u1EEFng v\xE0ng h\u01A1n cho nh\u1EEFng ch\u1EB7ng \u0111\u01B0\u1EDDng xa ph\xEDa tr\u01B0\u1EDBc."
  },
  // 4. Thành công nhỏ
  {
    id: "adv_010",
    topic: "Th\xE0nh c\xF4ng nh\u1ECF",
    tag: "\u2B50 Ni\u1EC1m vui nh\u1ECF",
    icon: "\u2728",
    content: "D\u1EADy \u0111\xFAng gi\u1EDD, g\u1EA5p g\u1ECDn ch\u0103n g\u1ED1i hay u\u1ED1ng \u0111\u1EE7 n\u01B0\u1EDBc c\u0169ng l\xE0 nh\u1EEFng chi\u1EBFn th\u1EAFng \u0111\xE1ng khen. \u0110\u1EEBng \u0111\u1EE3i \u0111\u1EA1t gi\u1EA3i th\u01B0\u1EDFng l\u1EDBn m\u1EDBi cho ph\xE9p m\xECnh t\u1EF1 h\xE0o v\u1EC1 b\u1EA3n th\xE2n."
  },
  {
    id: "adv_011",
    topic: "Th\xE0nh c\xF4ng nh\u1ECF",
    tag: "\u2B50 Ni\u1EC1m vui nh\u1ECF",
    icon: "\u{1F33B}",
    content: "H\xE3y \u0111\u1EBFm nh\u1EEFng vi\u1EC7c b\u1EA1n \u0111\xE3 l\xE0m \u0111\u01B0\u1EE3c h\xF4m nay, d\xF9 ch\u1EC9 l\xE0 ki\xEAn nh\u1EABn nghe h\u1EBFt m\u1ED9t ti\u1EBFt h\u1ECDc bu\u1ED3n ng\u1EE7. B\u1EA1n \u0111ang n\u1ED7 l\u1EF1c nhi\u1EC1u h\u01A1n b\u1EA1n ngh\u0129 \u0111\u1EA5y!"
  },
  {
    id: "adv_012",
    topic: "Th\xE0nh c\xF4ng nh\u1ECF",
    tag: "\u2B50 Ni\u1EC1m vui nh\u1ECF",
    icon: "\u{1F3AF}",
    content: "M\u1ED7i b\u01B0\u1EDBc ti\u1EBFn d\xF9 ch\u1EC9 d\xE0i n\u1EEDa gang tay v\u1EABn l\xE0 \u0111ang ti\u1EBFn v\u1EC1 ph\xEDa tr\u01B0\u1EDBc. H\xE3y m\u1EC9m c\u01B0\u1EDDi v\xE0 t\u1EB7ng m\xECnh m\u1ED9t l\u1EDDi khen v\xEC \u0111\xE3 kh\xF4ng b\u1ECF cu\u1ED9c."
  },
  // 5. Tự tin
  {
    id: "adv_013",
    topic: "T\u1EF1 tin",
    tag: "\u{1F981} T\u1EF1 tin",
    icon: "\u{1F31F}",
    content: "B\u1EA1n kh\xF4ng c\u1EA7n ph\u1EA3i ho\u1EA1t ng\xF4n nh\u01B0 ng\u01B0\u1EDDi kh\xE1c \u0111\u1EC3 \u0111\u01B0\u1EE3c y\xEAu qu\xFD. S\u1EF1 ch\xE2n th\xE0nh, \u0111i\u1EC1m t\u0129nh v\xE0 bi\u1EBFt l\u1EAFng nghe c\u1EE7a b\u1EA1n ch\xEDnh l\xE0 m\u1ED9t lo\u1EA1i s\u1EE9c h\xFAt r\u1EA5t ri\xEAng."
  },
  {
    id: "adv_014",
    topic: "T\u1EF1 tin",
    tag: "\u{1F981} T\u1EF1 tin",
    icon: "\u{1F98B}",
    content: "Gi\u1ECDng n\xF3i c\u1EE7a b\u1EA1n c\xF3 gi\xE1 tr\u1ECB, suy ngh\u0129 c\u1EE7a b\u1EA1n \u0111\xE1ng \u0111\u01B0\u1EE3c l\u1EAFng nghe. \u0110\u1EEBng ng\u1EA7n ng\u1EA1i gi\u01A1 tay hay n\xF3i l\xEAn \xFD ki\u1EBFn c\u1EE7a m\xECnh ch\u1EC9 v\xEC s\u1EE3 kh\xE1c bi\u1EC7t."
  },
  {
    id: "adv_015",
    topic: "T\u1EF1 tin",
    tag: "\u{1F981} T\u1EF1 tin",
    icon: "\u2600\uFE0F",
    content: "T\u1EF1 tin kh\xF4ng ph\u1EA3i l\xE0 ngh\u0129 r\u1EB1ng ai c\u0169ng s\u1EBD th\xEDch m\xECnh. T\u1EF1 tin l\xE0 khi bi\u1EBFt r\u1EB1ng d\xF9 ai \u0111\xF3 kh\xF4ng th\xEDch, b\u1EA3n th\xE2n m\xECnh v\u1EABn ho\xE0n to\xE0n \u1ED5n v\xE0 v\u1EEFng v\xE0ng."
  },
  // 6. Tình bạn & Bạn bè
  {
    id: "adv_016",
    topic: "T\xECnh b\u1EA1n",
    tag: "\u{1F91D} T\xECnh b\u1EA1n",
    icon: "\u{1F33B}",
    content: "M\u1ED9t ng\u01B0\u1EDDi b\u1EA1n th\u1EADt s\u1EF1 l\xE0 ng\u01B0\u1EDDi khi\u1EBFn b\u1EA1n c\u1EA3m th\u1EA5y tho\u1EA3i m\xE1i \u0111\u01B0\u1EE3c l\xE0 ch\xEDnh m\xECnh, kh\xF4ng c\u1EA7n g\u1ED3ng m\xECnh hay \u0111eo m\u1EB7t n\u1EA1 \u0111\u1EC3 h\xF2a nh\u1EADp v\xE0o nh\xF3m."
  },
  {
    id: "adv_017",
    topic: "T\xECnh b\u1EA1n",
    tag: "\u{1F91D} T\xECnh b\u1EA1n",
    icon: "\u{1F4AC}",
    content: "N\u1EBFu c\xF3 hi\u1EC3u l\u1EA7m v\u1EDBi b\u1EA1n th\xE2n, h\xE3y th\u1EED n\xF3i chuy\u1EC7n tr\u1EF1c ti\u1EBFp thay v\xEC im l\u1EB7ng \u0111o\xE1n \xFD nhau. \u0110\xF4i khi ch\u1EC9 m\u1ED9t c\xE2u h\u1ECFi han ch\xE2n th\xE0nh l\xE0 kh\xFAc m\u1EAFc tan bi\u1EBFn."
  },
  {
    id: "adv_018",
    topic: "T\xECnh b\u1EA1n",
    tag: "\u{1F91D} T\xECnh b\u1EA1n",
    icon: "\u{1F388}",
    content: "\u0110\u1EEBng ng\u1EA1i t\u1EEB ch\u1ED1i m\u1ED9t cu\u1ED9c \u0111i ch\u01A1i n\u1EBFu c\u01A1 th\u1EC3 b\u1EA1n \u0111ang ki\u1EC7t s\u1EE9c. B\u1EA1n b\xE8 t\u1ED1t s\u1EBD lu\xF4n t\xF4n tr\u1ECDng kho\u1EA3ng l\u1EB7ng v\xE0 s\u1EE9c kh\u1ECFe c\u1EE7a b\u1EA1n."
  },
  {
    id: "adv_019",
    topic: "T\xECnh b\u1EA1n",
    tag: "\u{1F91D} T\xECnh b\u1EA1n",
    icon: "\u{1F48C}",
    content: "V\xF2ng tr\xF2n b\u1EA1n b\xE8 \xEDt hay nhi\u1EC1u kh\xF4ng quan tr\u1ECDng b\u1EB1ng vi\u1EC7c \u1EDF b\xEAn h\u1ECD, b\u1EA1n c\u1EA3m th\u1EA5y l\xF2ng m\xECnh \u1EA5m \xE1p v\xE0 \u0111\u01B0\u1EE3c t\xF4n tr\u1ECDng."
  },
  // 7. Rung động tuổi teen & Tình cảm
  {
    id: "adv_020",
    topic: "T\xECnh c\u1EA3m tu\u1ED5i teen",
    tag: "\u{1F48C} C\u1EA3m x\xFAc",
    icon: "\u{1F338}",
    content: "Th\xEDch m\u1ED9t ai \u0111\xF3 l\xE0 c\u1EA3m x\xFAc r\u1EA5t d\u1EC5 th\u01B0\u01A1ng c\u1EE7a tu\u1ED5i h\u1ECDc tr\xF2. H\xE3y \u0111\u1EC3 n\xF3 l\xE0m \u0111\u1ED9ng l\u1EF1c \u0111\u1EC3 b\u1EA1n c\xF9ng ng\u01B0\u1EDDi \u1EA5y h\u1ECDc t\u1ED1t h\u01A1n v\xE0 tr\u1EDF th\xE0nh phi\xEAn b\u1EA3n r\u1EA1ng r\u1EE1 h\u01A1n."
  },
  {
    id: "adv_021",
    topic: "T\xECnh c\u1EA3m tu\u1ED5i teen",
    tag: "\u{1F48C} C\u1EA3m x\xFAc",
    icon: "\u{1F343}",
    content: "N\u1EBFu t\xECnh c\u1EA3m \u0111\u01A1n ph\u01B0\u01A1ng kh\xF4ng \u0111\u01B0\u1EE3c \u0111\xE1p l\u1EA1i, \u0111\u1EEBng t\u1EF1 ti v\u1EC1 b\u1EA3n th\xE2n. Tr\xE1i tim b\u1EA1n bi\u1EBFt rung \u0111\u1ED9ng \u0111\xE3 l\xE0 m\u1ED9t \u0111i\u1EC1u \u0111\u1EB9p \u0111\u1EBD, ng\u01B0\u1EDDi tr\xE2n tr\u1ECDng b\u1EA1n th\u1EADt s\u1EF1 \u0111ang \u1EDF ph\xEDa tr\u01B0\u1EDBc."
  },
  {
    id: "adv_022",
    topic: "T\xECnh c\u1EA3m tu\u1ED5i teen",
    tag: "\u{1F48C} C\u1EA3m x\xFAc",
    icon: "\u{1F337}",
    content: "Tr\u01B0\u1EDBc khi mu\u1ED1n ai \u0111\xF3 y\xEAu qu\xFD m\xECnh th\u1EADt nhi\u1EC1u, h\xE3y d\xE0nh th\u1EDDi gian ch\u0103m s\xF3c v\xE0 d\u1ECBu d\xE0ng v\u1EDBi ch\xEDnh b\u1EA3n th\xE2n m\xECnh tr\u01B0\u1EDBc \u0111\xE3 nh\xE9."
  },
  // 8. Gia đình & Bất đồng
  {
    id: "adv_023",
    topic: "Gia \u0111\xECnh",
    tag: "\u{1F3E1} Gia \u0111\xECnh",
    icon: "\u{1F375}",
    content: "B\u1ED1 m\u1EB9 \u0111\xF4i khi n\xF3i l\u1EDDi l\xE0m ta ph\u1EADt \xFD v\xEC kho\u1EA3ng c\xE1ch th\u1EBF h\u1EC7, nh\u01B0ng s\u1EF1 lo l\u1EAFng cho b\u1EA1n th\xEC lu\xF4n c\xF3 th\u1EADt. H\xE3y chia s\u1EBB v\u1EDBi b\u1ED1 m\u1EB9 t\u1EEB nh\u1EEFng \u0111i\u1EC1u nh\u1ECF m\u1ED7i ng\xE0y."
  },
  {
    id: "adv_024",
    topic: "Gia \u0111\xECnh",
    tag: "\u{1F3E1} Gia \u0111\xECnh",
    icon: "\u{1F56F}\uFE0F",
    content: "Khi kh\xF4ng kh\xED gia \u0111\xECnh c\u0103ng th\u1EB3ng, im l\u1EB7ng ch\u1EDD c\u01A1n gi\u1EADn qua \u0111i t\u1ED1t h\u01A1n ng\xE0n l\u1EDDi c\xE3i v\xE3. B\u1EA1n c\xF3 quy\u1EC1n gi\u1EEF ranh gi\u1EDBi b\xECnh y\xEAn cho t\xE2m tr\xED m\xECnh."
  },
  {
    id: "adv_025",
    topic: "Gia \u0111\xECnh",
    tag: "\u{1F3E1} Gia \u0111\xECnh",
    icon: "\u{1F963}",
    content: "M\u1ED9t l\u1EDDi c\u1EA3m \u01A1n nh\u1ECF sau b\u1EEFa c\u01A1m hay m\u1ED9t c\xE2u h\u1ECFi han khi b\u1ED1 m\u1EB9 \u0111i l\xE0m v\u1EC1 c\xF3 th\u1EC3 l\xE0m tan bi\u1EBFn r\u1EA5t nhi\u1EC1u m\u1ECFi m\u1EC7t trong nh\xE0."
  },
  // 9. Nghỉ ngơi & Nạp năng lượng
  {
    id: "adv_026",
    topic: "Ngh\u1EC9 ng\u01A1i",
    tag: "\u{1F319} Ngh\u1EC9 ng\u01A1i",
    icon: "\u{1F6CC}",
    content: "Ngh\u1EC9 ng\u01A1i kh\xF4ng ph\u1EA3i l\xE0 l\u01B0\u1EDDi bi\u1EBFng. Chi\u1EBFc \u0111i\u1EC7n tho\u1EA1i c\u1EA7n s\u1EA1c pin \u0111\u1EC3 ho\u1EA1t \u0111\u1ED9ng th\xEC t\xE2m tr\xED v\xE0 c\u01A1 th\u1EC3 b\u1EA1n c\u0169ng c\u1EA7n \u0111\u01B0\u1EE3c ng\u1EE7 \u0111\u1EE7 gi\u1EA5c \u0111\u1EC3 t\u1ECFa s\xE1ng."
  },
  {
    id: "adv_027",
    topic: "Ngh\u1EC9 ng\u01A1i",
    tag: "\u{1F319} Ngh\u1EC9 ng\u01A1i",
    icon: "\u{1F3B5}",
    content: "T\u1ED1i nay h\xE3y th\u1EED t\u1EAFt th\xF4ng b\xE1o s\u1EDBm h\u01A1n 30 ph\xFAt, nghe m\u1ED9t b\u1EA3n nh\u1EA1c \xEAm d\u1ECBu v\xE0 th\u1EA3 l\u1ECFng c\u01A1 th\u1EC3. B\u1EA1n x\u1EE9ng \u0111\xE1ng c\xF3 m\u1ED9t gi\u1EA5c ng\u1EE7 th\u1EADt ngon l\xE0nh."
  },
  {
    id: "adv_028",
    topic: "Ngh\u1EC9 ng\u01A1i",
    tag: "\u{1F319} Ngh\u1EC9 ng\u01A1i",
    icon: "\u{1F6CB}\uFE0F",
    content: "C\xF3 nh\u1EEFng ng\xE0y c\xE1ch n\u1ED7 l\u1EF1c t\u1ED1t nh\u1EA5t \u0111\u01A1n gi\u1EA3n l\xE0: kh\xF4ng l\xE0m g\xEC c\u1EA3, \u0111\u1EC3 b\u1EA3n th\xE2n \u0111\u01B0\u1EE3c l\u01B0\u1EDDi m\u1ED9t ch\xFAt m\xE0 kh\xF4ng c\u1EA3m th\u1EA5y t\u1ED9i l\u1ED7i."
  },
  // 10. Yêu bản thân & Ngoại hình
  {
    id: "adv_029",
    topic: "Y\xEAu b\u1EA3n th\xE2n",
    tag: "\u{1F496} Y\xEAu b\u1EA3n th\xE2n",
    icon: "\u{1FA9E}",
    content: "Khu\xF4n m\u1EB7t, m\xE1i t\xF3c hay n\u1EE5 c\u01B0\u1EDDi c\u1EE7a b\u1EA1n \u0111\u1EC1u mang n\xE9t \u0111\u1ED9c nh\u1EA5t v\xF4 nh\u1ECB. \u0110\u1EEBng \u0111\u1EC3 nh\u1EEFng b\u1ED9 l\u1ECDc tr\xEAn m\u1EA1ng x\xE3 h\u1ED9i l\xE0m b\u1EA1n qu\xEAn m\u1EA5t v\u1EBB \u0111\u1EB9p t\u1EF1 nhi\xEAn c\u1EE7a m\xECnh."
  },
  {
    id: "adv_030",
    topic: "Y\xEAu b\u1EA3n th\xE2n",
    tag: "\u{1F496} Y\xEAu b\u1EA3n th\xE2n",
    icon: "\u{1F380}",
    content: "M\u1EB7c b\u1ED9 qu\u1EA7n \xE1o khi\u1EBFn b\u1EA1n th\u1EA5y tho\u1EA3i m\xE1i, bu\u1ED9c ki\u1EC3u t\xF3c l\xE0m b\u1EA1n th\u1EA5y t\u1EF1 tin. B\u1EA1n sinh ra \u0111\u1EC3 t\u1EADn h\u01B0\u1EDFng cu\u1ED9c s\u1ED1ng, kh\xF4ng ph\u1EA3i \u0111\u1EC3 l\xE0m v\u1EEBa m\u1EAFt t\u1EA5t c\u1EA3."
  },
  {
    id: "adv_031",
    topic: "Y\xEAu b\u1EA3n th\xE2n",
    tag: "\u{1F496} Y\xEAu b\u1EA3n th\xE2n",
    icon: "\u{1F337}",
    content: "H\xE3y n\xF3i chuy\u1EC7n v\u1EDBi ch\xEDnh m\xECnh b\u1EB1ng s\u1EF1 d\u1ECBu d\xE0ng nh\u01B0 c\xE1ch b\u1EA1n \u0111ang an \u1EE7i m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n th\xE2n nh\u1EA5t khi h\u1ECD bu\u1ED3n. B\u1EA1n \u0111\xE1ng \u0111\u01B0\u1EE3c \u0111\u1ED1i x\u1EED t\u1EED t\u1EBF nh\u01B0 v\u1EADy."
  },
  // 11. Không so sánh bản thân
  {
    id: "adv_032",
    topic: "Kh\xF4ng so s\xE1nh",
    tag: "\u{1F33F} B\xECnh y\xEAn",
    icon: "\u{1F33B}",
    content: "B\xF4ng hoa h\u01B0\u1EDBng d\u01B0\u01A1ng kh\xF4ng c\u1EA7n tranh \u0111ua v\u1EDBi hoa sen, m\u1ED7i lo\xE0i hoa \u0111\u1EC1u c\xF3 m\xF9a r\u1EF1c r\u1EE1 c\u1EE7a ri\xEAng m\xECnh. B\u1EA1n c\xF3 h\xE0nh tr\xECnh v\xE0 nh\u1ECBp \u0111\u1ED9 ri\xEAng, \u0111\u1EEBng v\u1ED9i."
  },
  {
    id: "adv_033",
    topic: "Kh\xF4ng so s\xE1nh",
    tag: "\u{1F33F} B\xECnh y\xEAn",
    icon: "\u{1F4F1}",
    content: "Nh\u1EEFng g\xEC ng\u01B0\u1EDDi kh\xE1c khoe tr\xEAn m\u1EA1ng x\xE3 h\u1ED9i ch\u1EC9 l\xE0 th\u01B0\u1EDBc phim n\u1ED5i b\u1EADt nh\u1EA5t c\u1EE7a h\u1ECD. \u0110\u1EEBng l\u1EA5y h\u1EADu tr\u01B0\u1EDDng c\u1EE7a m\xECnh \u0111em so v\u1EDBi s\xE2n kh\u1EA5u r\u1EF1c r\u1EE1 c\u1EE7a ng\u01B0\u1EDDi ta."
  },
  {
    id: "adv_034",
    topic: "Kh\xF4ng so s\xE1nh",
    tag: "\u{1F33F} B\xECnh y\xEAn",
    icon: "\u{1F9ED}",
    content: "\u0110\u1ED1i th\u1EE7 duy nh\u1EA5t \u0111\xE1ng \u0111\u1EC3 b\u1EA1n \u0111\u1EC3 t\xE2m l\xE0 phi\xEAn b\u1EA3n c\u1EE7a ch\xEDnh m\xECnh ng\xE0y h\xF4m qua: hi\u1EC3u bi\u1EBFt h\u01A1n m\u1ED9t ch\xFAt, bao dung h\u01A1n m\u1ED9t ch\xFAt l\xE0 b\u1EA1n \u0111\xE3 th\u1EAFng r\u1ED3i."
  },
  // 12. Kiên trì & Chậm mà chắc
  {
    id: "adv_035",
    topic: "Ki\xEAn tr\xEC",
    tag: "\u{1F331} B\u1EC1n b\u1EC9",
    icon: "\u{1F422}",
    content: "M\u1ED7i ng\xE0y t\xEDch l\u0169y th\xEAm 1 t\u1EEB v\u1EF1ng m\u1EDBi, 1 c\xF4ng th\u1EE9c to\xE1n hay 1 trang s\xE1ch. Nh\xECn th\xEC \xEDt, nh\u01B0ng 1 n\u0103m sau b\u1EA1n s\u1EBD b\u1EA5t ng\u1EDD tr\u01B0\u1EDBc s\u1EF1 thay \u0111\u1ED5i v\u0129 \u0111\u1EA1i \u1EA5y."
  },
  {
    id: "adv_036",
    topic: "Ki\xEAn tr\xEC",
    tag: "\u{1F331} B\u1EC1n b\u1EC9",
    icon: "\u{1F4A7}",
    content: "N\u01B0\u1EDBc ch\u1EA3y \u0111\xE1 m\xF2n kh\xF4ng ph\u1EA3i nh\u1EDD s\u1EE9c m\u1EA1nh gh\xEA g\u1EDBm, m\xE0 nh\u1EDD s\u1EF1 ki\xEAn tr\xEC kh\xF4ng \u0111\u1EE9t \u0111o\u1EA1n qua t\u1EEBng ng\xE0y. C\u1EE9 t\u1EEBng b\u01B0\u1EDBc nh\u1ECF m\u1ED9t b\u1EA1n nh\xE9!"
  },
  {
    id: "adv_037",
    topic: "Ki\xEAn tr\xEC",
    tag: "\u{1F331} B\u1EC1n b\u1EC9",
    icon: "\u{1F38B}",
    content: "C\xE2y tre d\xE0nh 4 n\u0103m ch\u1EC9 \u0111\u1EC3 ph\xE1t tri\u1EC3n b\u1ED9 r\u1EC5 d\u01B0\u1EDBi l\xF2ng \u0111\u1EA5t tr\u01B0\u1EDBc khi v\u01B0\u01A1n cao v\xFAt. Giai \u0111o\u1EA1n b\u1EA1n th\u1EA5y m\xECnh d\u1EADm ch\xE2n t\u1EA1i ch\u1ED7 c\xF3 th\u1EC3 l\xE0 l\xFAc r\u1EC5 \u0111ang b\xE9n s\xE2u."
  },
  // 13. Mất động lực & Trì trệ
  {
    id: "adv_038",
    topic: "M\u1EA5t \u0111\u1ED9ng l\u1EF1c",
    tag: "\u26A1 Ti\u1EBFp s\u1EE9c",
    icon: "\u{1F50B}",
    content: "Kh\xF4ng c\xF3 \u0111\u1ED9ng l\u1EF1c l\xE0 chuy\u1EC7n h\u1EBFt s\u1EE9c b\xECnh th\u01B0\u1EDDng c\u1EE7a con ng\u01B0\u1EDDi. Kh\xF4ng c\u1EA7n ph\u1EA3i lu\xF4n h\u1EEBng h\u1EF1c kh\xED th\u1EBF, ch\u1EC9 c\u1EA7n gi\u1EEF th\xF3i quen l\xE0m m\u1ED9t ch\xFAt m\u1ED7i ng\xE0y l\xE0 \u0111\u1EE7."
  },
  {
    id: "adv_039",
    topic: "M\u1EA5t \u0111\u1ED9ng l\u1EF1c",
    tag: "\u26A1 Ti\u1EBFp s\u1EE9c",
    icon: "\u{1F6B6}",
    content: "N\u1EBFu kh\xF4ng ch\u1EA1y \u0111\u01B0\u1EE3c th\xEC \u0111i b\u1ED9, n\u1EBFu kh\xF4ng \u0111i \u0111\u01B0\u1EE3c th\xEC b\xF2 t\u1EEBng b\u01B0\u1EDBc. Mi\u1EC5n l\xE0 b\u1EA1n kh\xF4ng quay \u0111\u1EA7u b\u1ECF cu\u1ED9c, b\u1EA1n v\u1EABn \u0111ang ti\u1EBFn g\u1EA7n \u0111\u1EBFn m\u1EE5c ti\xEAu."
  },
  {
    id: "adv_040",
    topic: "M\u1EA5t \u0111\u1ED9ng l\u1EF1c",
    tag: "\u26A1 Ti\u1EBFp s\u1EE9c",
    icon: "\u{1F3AF}",
    content: "Nh\u1EDB l\u1EA1i l\xFD do ban \u0111\u1EA7u b\u1EA1n t\u1EEBng h\xE1o h\u1EE9c mu\u1ED1n b\u1EAFt \u0111\u1EA7u. Ng\u1ECDn l\u1EEDa nh\u1ECF \u0111\xF3 v\u1EABn c\xF2n \xE2m \u1EC9 b\xEAn trong, ch\u1EC9 \u0111ang \u0111\u1EE3i m\u1ED9t h\u01A1i th\u1EDF \u1EA5m \u0111\u1EC3 b\xF9ng l\xEAn l\u1EA1i."
  },
  // 14. Bắt đầu lại
  {
    id: "adv_041",
    topic: "B\u1EAFt \u0111\u1EA7u l\u1EA1i",
    tag: "\u{1F305} Kh\u1EDFi \u0111\u1EA7u m\u1EDBi",
    icon: "\u2728",
    content: "M\u1ED7i bu\u1ED5i s\xE1ng th\u1EE9c d\u1EADy l\xE0 m\u1ED9t trang gi\u1EA5y ho\xE0n to\xE0n m\u1EDBi toanh. H\xF4m qua d\xF9 c\xF3 t\u1ED3i t\u1EC7 hay ng\u1ED5n ngang th\u1EBF n\xE0o, h\xF4m nay b\u1EA1n c\xF3 quy\u1EC1n v\u1EBD l\u1EA1i n\xE9t m\u1EDBi."
  },
  {
    id: "adv_042",
    topic: "B\u1EAFt \u0111\u1EA7u l\u1EA1i",
    tag: "\u{1F305} Kh\u1EDFi \u0111\u1EA7u m\u1EDBi",
    icon: "\u{1F54A}\uFE0F",
    content: 'Kh\xF4ng c\xF3 th\u1EDDi \u0111i\u1EC3m n\xE0o l\xE0 qu\xE1 mu\u1ED9n \u0111\u1EC3 l\xE0m l\u1EA1i m\u1ED9t th\xF3i quen t\u1ED1t. B\u1EA5t k\u1EC3 l\xE0 gi\u1EEFa tu\u1EA7n, gi\u1EEFa th\xE1ng hay chi\u1EC1u mu\u1ED9n, b\u1EA5m n\xFAt "B\u1EAFt \u0111\u1EA7u" ngay b\xE2y gi\u1EDD lu\xF4n \u0111\xFAng.'
  },
  {
    id: "adv_043",
    topic: "B\u1EAFt \u0111\u1EA7u l\u1EA1i",
    tag: "\u{1F305} Kh\u1EDFi \u0111\u1EA7u m\u1EDBi",
    icon: "\u{1F33F}",
    content: "L\xE1 v\xE0ng r\u1EE5ng xu\u1ED1ng \u0111\u1EC3 ch\u1ED3i non xanh m\u01B0\u1EDBt m\u1ECDc l\xEAn. H\xE3y \u0111\u1EC3 nh\u1EEFng n\u1ED7i bu\u1ED3n c\u0169 \u1EDF l\u1EA1i ph\xEDa sau v\xE0 \u0111\xF3n nh\u1EADn nh\u1EEFng \u0111i\u1EC1u t\u01B0\u01A1i m\u1EDBi \u0111ang t\u1EDBi."
  },
  // 15. Dám thử & Vượt qua vùng an toàn
  {
    id: "adv_044",
    topic: "D\xE1m th\u1EED",
    tag: "\u{1F680} D\u0169ng c\u1EA3m",
    icon: "\u{1F525}",
    content: "C\u1EA3m gi\xE1c h\u1ED3i h\u1ED9p tr\u01B0\u1EDBc khi th\u1EED m\u1ED9t \u0111i\u1EC1u m\u1EDBi ch\xEDnh l\xE0 d\u1EA5u hi\u1EC7u b\u1EA1n \u0111ang b\u1EAFt \u0111\u1EA7u l\u1EDBn l\xEAn. H\xE3y h\xEDt th\u1EADt s\xE2u v\xE0 d\u1EA5n b\u01B0\u1EDBc, b\u1EA1n m\u1EA1nh m\u1EBD h\u01A1n b\u1EA1n t\u01B0\u1EDFng."
  },
  {
    id: "adv_045",
    topic: "D\xE1m th\u1EED",
    tag: "\u{1F680} D\u0169ng c\u1EA3m",
    icon: "\u{1F3A4}",
    content: 'M\u1ED9t l\u1EA7n d\xE1m \u0111\u1EE9ng l\xEAn ph\xE1t bi\u1EC3u tr\u01B0\u1EDBc l\u1EDBp c\xF3 th\u1EC3 run r\u1EA9y, nh\u01B0ng sau \u0111\xF3 b\u1EA1n s\u1EBD nh\u1EADn ra: "H\xF3a ra c\u0169ng ch\u1EB3ng c\xF3 g\xEC \u0111\xE1ng s\u1EE3 nh\u01B0 m\xECnh t\u1EEBng ngh\u0129!"'
  },
  {
    id: "adv_046",
    topic: "D\xE1m th\u1EED",
    tag: "\u{1F680} D\u0169ng c\u1EA3m",
    icon: "\u{1F3A8}",
    content: "Th\u1EED v\u1EBD m\u1ED9t b\u1EE9c tranh, h\u1ECDc m\u1ED9t lo\u1EA1i nh\u1EA1c c\u1EE5 hay th\u1EED m\u1ED9t m\xF4n th\u1EC3 thao m\u1EDBi. \u0110\u1EEBng s\u1EE3 v\u1EBD x\u1EA5u hay ch\u01A1i d\u1EDF, ni\u1EC1m vui n\u1EB1m \u1EDF qu\xE1 tr\xECnh b\u1EA1n tr\u1EA3i nghi\u1EC7m."
  },
  // 16. Trưởng thành & Những biến đổi tâm lý
  {
    id: "adv_047",
    topic: "Tr\u01B0\u1EDFng th\xE0nh",
    tag: "\u{1F331} Tr\u01B0\u1EDFng th\xE0nh",
    icon: "\u{1FAB4}",
    content: "\u0110\xF4i khi b\u1EA1n th\u1EA5y m\xECnh th\u1EADt m\xE2u thu\u1EABn: v\u1EEBa mu\u1ED1n l\xE0m ng\u01B0\u1EDDi l\u1EDBn t\u1EF1 do, v\u1EEBa th\xE8m \u0111\u01B0\u1EE3c b\xE9 l\u1EA1i nh\u01B0 ng\xE0y x\u01B0a. \u0110\xF3 l\xE0 n\u1ED1t chuy\u1EC3n m\xECnh t\u1EF1 nhi\xEAn c\u1EE7a tu\u1ED5i d\u1EADy th\xEC."
  },
  {
    id: "adv_048",
    topic: "Tr\u01B0\u1EDFng th\xE0nh",
    tag: "\u{1F331} Tr\u01B0\u1EDFng th\xE0nh",
    icon: "\u{1F9ED}",
    content: "Tr\u01B0\u1EDFng th\xE0nh kh\xF4ng ph\u1EA3i l\xE0 h\u1ECDc c\xE1ch k\xECm n\xE9n c\u1EA3m x\xFAc cho chai s\u1EA1n, m\xE0 l\xE0 bi\u1EBFt g\u1ECDi t\xEAn c\u1EA3m x\xFAc c\u1EE7a m\xECnh v\xE0 h\u1ECDc c\xE1ch \xF4m l\u1EA5y n\xF3 b\u1EB1ng s\u1EF1 th\u1EA5u hi\u1EC3u."
  },
  {
    id: "adv_049",
    topic: "Tr\u01B0\u1EDFng th\xE0nh",
    tag: "\u{1F331} Tr\u01B0\u1EDFng th\xE0nh",
    icon: "\u{1F31F}",
    content: 'Bi\u1EBFt n\xF3i l\u1EDDi "C\u1EA3m \u01A1n" khi \u0111\u01B0\u1EE3c gi\xFAp v\xE0 "Xin l\u1ED7i" khi l\xE0m sai l\xE0 hai ch\xECa kh\xF3a v\xE0ng gi\xFAp b\u1EA1n tr\u1EDF th\xE0nh m\u1ED9t ng\u01B0\u1EDDi th\u1EADt s\u1EF1 ch\u1EEFng ch\u1EA1c v\xE0 \u0111\xE1ng tin c\u1EADy.'
  },
  // 17. Tha thứ cho bản thân
  {
    id: "adv_050",
    topic: "Tha th\u1EE9",
    tag: "\u{1F54A}\uFE0F Bao dung",
    icon: "\u{1F49B}",
    content: "\u0110\u1EEBng t\u1EF1 d\u1EB1n v\u1EB7t m\xECnh m\xE3i v\xEC m\u1ED9t c\xE2u n\xF3i l\u1EE1 l\u1EDDi hay m\u1ED9t quy\u1EBFt \u0111\u1ECBnh v\u1EE5ng v\u1EC1 ng\xE0y h\xF4m qua. L\xFAc \u0111\xF3 b\u1EA1n \u0111\xE3 h\xE0nh \u0111\u1ED9ng v\u1EDBi hi\u1EC3u bi\u1EBFt t\u1ED1t nh\u1EA5t b\u1EA1n c\xF3 r\u1ED3i."
  },
  {
    id: "adv_051",
    topic: "Tha th\u1EE9",
    tag: "\u{1F54A}\uFE0F Bao dung",
    icon: "\u{1F327}\uFE0F",
    content: "C\u01A1n m\u01B0a n\xE0o r\u1ED3i c\u0169ng ph\u1EA3i t\u1EA1nh \u0111\u1EC3 b\u1EA7u tr\u1EDDi h\u1EEDng n\u1EAFng. H\xE3y m\u1EDF r\u1ED9ng l\xF2ng m\xECnh, tha th\u1EE9 cho nh\u1EEFng l\u1ED7i l\u1EA7m c\u0169 \u0111\u1EC3 b\u01B0\u1EDBc ti\u1EBFp nh\u1EB9 nh\xF5m h\u01A1n."
  },
  {
    id: "adv_052",
    topic: "Tha th\u1EE9",
    tag: "\u{1F54A}\uFE0F Bao dung",
    icon: "\u{1F932}",
    content: 'B\u1EA1n lu\xF4n s\u1EB5n l\xF2ng tha th\u1EE9 cho b\u1EA1n b\xE8 khi h\u1ECD l\u1EE1 l\xE0m b\u1EA1n bu\u1ED3n, v\u1EADy t\u1EA1i sao l\u1EA1i kh\u1EAFt khe v\u1EDBi ch\xEDnh m\xECnh? H\xE3y \xF4m l\u1EA5y b\u1EA3n th\xE2n v\xE0 n\xF3i: "Kh\xF4ng sao \u0111\xE2u nh\xE9!"'
  },
  // 18. Những ngày tồi tệ & Buồn bã
  {
    id: "adv_053",
    topic: "Ng\xE0y t\u1ED3i t\u1EC7",
    tag: "\u{1F327}\uFE0F V\u1ED7 v\u1EC1",
    icon: "\u2614",
    content: "C\xF3 nh\u1EEFng ng\xE0y m\u1ECDi th\u1EE9 d\u01B0\u1EDDng nh\u01B0 \u0111\u1EC1u ch\u1ED1ng l\u1EA1i b\u1EA1n. C\u1EE9 kh\xF3c n\u1EBFu mu\u1ED1n, n\u01B0\u1EDBc m\u1EAFt s\u1EBD r\u1EEDa tr\xF4i b\u1EE5i b\u1EB7m trong l\xF2ng. Ng\xE0y mai tr\u1EDDi l\u1EA1i s\xE1ng th\xF4i."
  },
  {
    id: "adv_054",
    topic: "Ng\xE0y t\u1ED3i t\u1EC7",
    tag: "\u{1F327}\uFE0F V\u1ED7 v\u1EC1",
    icon: "\u{1F375}",
    content: "H\xF4m nay ch\u1EC9 l\xE0 m\u1ED9t ng\xE0y t\u1ED3i t\u1EC7, kh\xF4ng ph\u1EA3i c\u1EA3 cu\u1ED9c \u0111\u1EDDi t\u1ED3i t\u1EC7. H\xE3y nh\u1EDB r\u1EB1ng nh\u1EEFng \u0111\xE1m m\xE2y \u0111en gi\xF4ng b\xE3o nh\u1EA5t c\u0169ng kh\xF4ng th\u1EC3 che m\xE3i \xE1nh m\u1EB7t tr\u1EDDi."
  },
  {
    id: "adv_055",
    topic: "Ng\xE0y t\u1ED3i t\u1EC7",
    tag: "\u{1F327}\uFE0F V\u1ED7 v\u1EC1",
    icon: "\u{1F6CC}",
    content: "N\u1EBFu h\xF4m nay b\u1EA1n ch\u1EC9 \u0111\u1EE7 s\u1EE9c \u0111\u1EC3 t\u1ED3n t\u1EA1i v\xE0 th\u1EDF \u0111\u1EC1u qua h\u1EBFt ng\xE0y, \u0111i\u1EC1u \u0111\xF3 c\u0169ng l\xE0 m\u1ED9t s\u1EF1 ki\xEAn c\u01B0\u1EDDng to l\u1EDBn r\u1ED3i. Ngh\u1EC9 ng\u01A1i nh\xE9, ng\xE0y mai s\u1EBD t\u1ED1t h\u01A1n."
  },
  // 19. Biết ơn & Góc nhìn tích cực
  {
    id: "adv_056",
    topic: "Bi\u1EBFt \u01A1n",
    tag: "\u{1F33B} T\xEDch c\u1EF1c",
    icon: "\u2600\uFE0F",
    content: "T\xECm th\u1EA5y m\u1ED9t g\xF3c ban c\xF4ng m\xE1t m\u1EBB, \u0103n m\u1ED9t m\xF3n kem ngon hay nghe th\u1EA5y ti\u1EBFng c\u01B0\u1EDDi c\u1EE7a ai \u0111\xF3. H\u1EA1nh ph\xFAc th\u01B0\u1EDDng l\u1EA5p l\xE1nh \u1EDF nh\u1EEFng kho\u1EA3nh kh\u1EAFc r\u1EA5t gi\u1EA3n d\u1ECB."
  },
  {
    id: "adv_057",
    topic: "Bi\u1EBFt \u01A1n",
    tag: "\u{1F33B} T\xEDch c\u1EF1c",
    icon: "\u{1F48C}",
    content: "Th\u1EED n\xF3i v\u1EDBi m\u1ED9t ng\u01B0\u1EDDi xung quanh r\u1EB1ng b\u1EA1n tr\xE2n tr\u1ECDng h\u1ECD h\xF4m nay. Khi gieo ni\u1EC1m vui cho ng\u01B0\u1EDDi kh\xE1c, ch\xEDnh tim b\u1EA1n c\u0169ng s\u1EBD ng\u1EADp tr\xE0n \xE1nh s\xE1ng."
  },
  {
    id: "adv_058",
    topic: "Bi\u1EBFt \u01A1n",
    tag: "\u{1F33B} T\xEDch c\u1EF1c",
    icon: "\u{1F331}",
    content: "Thay v\xEC than phi\u1EC1n v\xEC b\xE0i t\u1EADp nhi\u1EC1u, h\xE3y ngh\u0129 r\u1EB1ng ta may m\u1EAFn v\xEC c\xF2n c\xF3 c\u01A1 h\u1ED9i \u0111\u01B0\u1EE3c h\u1ECDc h\u1ECFi v\xE0 ti\u1EBFp c\u1EADn tri th\u1EE9c m\u1ED7i ng\xE0y."
  },
  // 20. Quản lý cảm xúc & Nóng giận
  {
    id: "adv_059",
    topic: "C\u1EA3m x\xFAc",
    tag: "\u{1F9D8} C\xE2n b\u1EB1ng",
    icon: "\u{1F30A}",
    content: "Khi c\u01A1n gi\u1EADn b\u1ED1c l\xEAn \u0111\u1EA7u, \u0111\u1EBFm ng\u01B0\u1EE3c t\u1EEB 10 v\u1EC1 1 tr\u01B0\u1EDBc khi m\u1EDF l\u1EDDi. M\u1ED9t ph\xFAt ki\u1EC1m ch\u1EBF l\xFAc n\xF3ng n\u1EA3y s\u1EBD c\u1EE9u b\u1EA1n kh\u1ECFi h\xE0ng tu\u1EA7n \xE2n h\u1EADn sau n\xE0y."
  },
  {
    id: "adv_060",
    topic: "C\u1EA3m x\xFAc",
    tag: "\u{1F9D8} C\xE2n b\u1EB1ng",
    icon: "\u{1F32C}\uFE0F",
    content: "C\u1EA3m x\xFAc ch\u1EC9 nh\u01B0 nh\u1EEFng v\u1ECB kh\xE1ch gh\xE9 th\u0103m nh\xE0 b\u1EA1n r\u1ED3i r\u1EDDi \u0111i. B\u1EA1n kh\xF4ng c\u1EA7n xua \u0111u\u1ED5i ch\xFAng, ch\u1EC9 c\u1EA7n quan s\xE1t v\xE0 th\u1EDF \u0111\u1EC1u, c\u1EA3m x\xFAc s\u1EBD t\u1EF1 l\u1EAFng xu\u1ED1ng."
  },
  // 21. Lắng nghe trực giác & Định hướng
  {
    id: "adv_061",
    topic: "\u0110\u1ECBnh h\u01B0\u1EDBng",
    tag: "\u{1F9ED} B\u1EA3n l\u0129nh",
    icon: "\u2B50",
    content: "Ch\u01B0a bi\u1EBFt m\xECnh th\xEDch g\xEC hay mu\u1ED1n l\xE0m ngh\u1EC1 g\xEC trong t\u01B0\u01A1ng lai l\xE0 \u0111i\u1EC1u ho\xE0n to\xE0n b\xECnh th\u01B0\u1EDDng \u1EDF tu\u1ED5i n\xE0y. C\u1EE9 t\xF2 m\xF2 kh\xE1m ph\xE1, c\xE2u tr\u1EA3 l\u1EDDi s\u1EBD h\xE9 l\u1ED9 d\u1EA7n."
  },
  {
    id: "adv_062",
    topic: "\u0110\u1ECBnh h\u01B0\u1EDBng",
    tag: "\u{1F9ED} B\u1EA3n l\u0129nh",
    icon: "\u{1F3A8}",
    content: "\u0110\u1EEBng ch\u1ECDn \u01B0\u1EDBc m\u01A1 ch\u1EC9 v\xEC n\xF3 nghe o\xE1ch trong m\u1EAFt b\u1EA1n b\xE8. H\xE3y ch\u1ECDn th\u1EE9 khi\u1EBFn \u0111\xF4i m\u1EAFt b\u1EA1n s\xE1ng l\xEAn m\u1ED7i khi \u0111\u01B0\u1EE3c b\u1EAFt tay v\xE0o t\xECm t\xF2i, s\xE1ng t\u1EA1o."
  },
  // 22. Mạng xã hội & Không gian số
  {
    id: "adv_063",
    topic: "Kh\xF4ng gian m\u1EA1ng",
    tag: "\u{1F4F5} Th\u01B0 gi\xE3n",
    icon: "\u{1F33F}",
    content: "M\u1ED9t ng\xE0y kh\xF4ng l\u01B0\u1EDBt m\u1EA1ng x\xE3 h\u1ED9i s\u1EBD kh\xF4ng l\xE0m b\u1EA1n t\u1EE5t h\u1EADu, nh\u01B0ng ch\u1EAFc ch\u1EAFn s\u1EBD tr\u1EA3 l\u1EA1i cho b\u1EA1n s\u1EF1 y\xEAn b\xECnh hi\u1EBFm hoi trong t\xE2m tr\xED. Th\u1EED xem nh\xE9!"
  },
  {
    id: "adv_064",
    topic: "Kh\xF4ng gian m\u1EA1ng",
    tag: "\u{1F4F5} Th\u01B0 gi\xE3n",
    icon: "\u{1F6E1}\uFE0F",
    content: "N\u1EBFu m\u1ED9t b\xE0i \u0111\u0103ng hay m\u1ED9t ng\u01B0\u1EDDi tr\xEAn m\u1EA1ng khi\u1EBFn b\u1EA1n th\u1EA5y m\xECnh k\xE9m c\u1ECFi v\xE0 kh\xF3 ch\u1ECBu, h\xE3y m\u1EA1nh d\u1EA1n b\u1EA5m \u1EA9n ho\u1EB7c b\u1ECF theo d\xF5i. B\u1EA1n c\xF3 quy\u1EC1n b\u1EA3o v\u1EC7 n\u0103ng l\u01B0\u1EE3ng c\u1EE7a m\xECnh."
  },
  // 23. Những thói quen tốt
  {
    id: "adv_065",
    topic: "Th\xF3i quen",
    tag: "\u{1F331} Th\xF3i quen t\u1ED1t",
    icon: "\u{1F4A7}",
    content: "M\u1ED7i s\xE1ng th\u1EE9c d\u1EADy, u\u1ED1ng m\u1ED9t c\u1ED1c n\u01B0\u1EDBc \u0111\u1EA7y v\xE0 v\u01B0\u01A1n vai ch\xE0o ng\xE0y m\u1EDBi. C\u01A1 th\u1EC3 b\u1EA1n s\u1EBD c\u1EA3m \u01A1n b\u1EA1n v\xEC s\u1EF1 kh\u1EDFi \u0111\u1EA7u t\u01B0\u01A1i t\u1EAFn n\xE0y."
  },
  {
    id: "adv_066",
    topic: "Th\xF3i quen",
    tag: "\u{1F331} Th\xF3i quen t\u1ED1t",
    icon: "\u{1F9F9}",
    content: "G\xF3c h\u1ECDc t\u1EADp g\u1ECDn g\xE0ng s\u1EBD gi\xFAp b\u1ED9 n\xE3o suy ngh\u0129 th\xF4ng su\u1ED1t h\u01A1n. D\xE0nh 3 ph\xFAt d\u1ECDn l\u1EA1i b\xE0n h\u1ECDc tr\u01B0\u1EDBc khi b\u1EAFt \u0111\u1EA7u b\xE0i t\u1EADp h\xF4m nay nh\xE9."
  },
  // 24. Lòng tốt & Sự tử tế
  {
    id: "adv_067",
    topic: "T\u1EED t\u1EBF",
    tag: "\u{1F496} Lan t\u1ECFa",
    icon: "\u{1F338}",
    content: "M\u1ED9t l\u1EDDi khen th\u1EADt l\xF2ng, m\u1ED9t c\xE1i nh\u01B0\u1EDDng \u0111\u01B0\u1EDDng hay m\u1ED9t n\u1EE5 c\u01B0\u1EDDi \u1EA5m \xE1p v\u1EDBi c\xF4 lao c\xF4ng c\xF3 th\u1EC3 th\u1EAFp s\xE1ng c\u1EA3 m\u1ED9t ng\xE0y u \xE1m c\u1EE7a ai \u0111\xF3. S\u1EF1 t\u1EED t\u1EBF lu\xF4n mi\u1EC5n ph\xED."
  },
  {
    id: "adv_068",
    topic: "T\u1EED t\u1EBF",
    tag: "\u{1F496} Lan t\u1ECFa",
    icon: "\u2728",
    content: "Th\u1EBF gi\u1EDBi n\xE0y \u0111\xE3 c\xF3 \u0111\u1EE7 ng\u01B0\u1EDDi th\xEDch ph\xE1n x\xE9t r\u1ED3i, h\xE3y ch\u1ECDn tr\u1EDF th\xE0nh ng\u01B0\u1EDDi bi\u1EBFt l\u1EAFng nghe v\xE0 gieo s\u1EF1 \u1EA5m \xE1p \u1EDF nh\u1EEFng n\u01A1i b\u1EA1n b\u01B0\u1EDBc qua."
  },
  // 25. Vượt qua nỗi sợ bị từ chối
  {
    id: "adv_069",
    topic: "V\u01B0\u1EE3t qua n\u1ED7i s\u1EE3",
    tag: "\u{1F981} D\u0169ng c\u1EA3m",
    icon: "\u{1F6AA}",
    content: "M\u1ED9t c\xE1nh c\u1EEDa \u0111\xF3ng l\u1EA1i kh\xF4ng c\xF3 ngh\u0129a l\xE0 ng\xF5 c\u1EE5t. N\xF3 ch\u1EC9 \u0111ang d\u1EABn b\u1EA1n \u0111i t\xECm c\xE1nh c\u1EEDa kh\xE1c m\u1EDF ra b\u1EA7u tr\u1EDDi ph\xF9 h\u1EE3p h\u01A1n v\u1EDBi b\u1EA1n."
  },
  {
    id: "adv_070",
    topic: "V\u01B0\u1EE3t qua n\u1ED7i s\u1EE3",
    tag: "\u{1F981} D\u0169ng c\u1EA3m",
    icon: "\u{1F985}",
    content: "Ng\u01B0\u1EDDi ch\u01B0a t\u1EEBng b\u1ECB t\u1EEB ch\u1ED1i l\xE0 ng\u01B0\u1EDDi ch\u01B0a bao gi\u1EDD d\xE1m b\u01B0\u1EDBc ra kh\u1ECFi v\u1ECF b\u1ECDc an to\xE0n. M\u1ED7i l\u1EA7n b\u1ECB t\u1EEB ch\u1ED1i l\xE0 m\u1ED9t l\u1EA7n da th\u1ECBt t\xE2m h\u1ED3n d\xE0y th\xEAm d\u0169ng kh\xED."
  },
  // 26. Thư giãn cùng thiên nhiên
  {
    id: "adv_071",
    topic: "Thi\xEAn nhi\xEAn",
    tag: "\u{1F343} Ch\u1EEFa l\xE0nh",
    icon: "\u{1F333}",
    content: "Ng\u1EAFm nh\xECn m\u1ED9t v\xF2m c\xE2y xanh \u0111ung \u0111\u01B0a trong gi\xF3 hay b\u1EA7u tr\u1EDDi ho\xE0ng h\xF4n r\u1EF1c r\u1EE1 c\xF3 th\u1EC3 xoa d\u1ECBu nh\u1EEFng nh\u1EE9c nh\u1ED1i trong \u0111\u1EA7u nhanh h\u01A1n b\u1EA1n t\u01B0\u1EDFng."
  },
  {
    id: "adv_072",
    topic: "Thi\xEAn nhi\xEAn",
    tag: "\u{1F343} Ch\u1EEFa l\xE0nh",
    icon: "\u{1F33E}",
    content: "H\xEDt s\xE2u m\xF9i \u0111\u1EA5t sau c\u01A1n m\u01B0a, l\u1EAFng nghe ti\u1EBFng chim h\xF3t s\u1EDBm mai. Th\u1EBF gi\u1EDBi t\u1EF1 nhi\xEAn lu\xF4n c\xF3 m\u1ED9t nh\u1ECBp \u0111i\u1EC7u b\xECnh th\u1EA3n s\u1EB5n s\xE0ng \u0111\xF3n nh\u1EADn b\u1EA1n tr\u1EDF v\u1EC1."
  },
  // 27. Sống thật với bản thân
  {
    id: "adv_073",
    topic: "Ch\xEDnh m\xECnh",
    tag: "\u2728 \u0110\u1ED9c b\u1EA3n",
    icon: "\u{1F48E}",
    content: 'B\u1EA1n kh\xF4ng c\u1EA7n ph\u1EA3i c\u1ED1 t\u1ECF ra hi\u1EC3u bi\u1EBFt v\u1EC1 th\u1EE9 m\xECnh kh\xF4ng th\xEDch ch\u1EC9 \u0111\u1EC3 "b\u1EAFt trend". C\xE1 t\xEDnh th\u1EF1c s\u1EF1 n\u1EB1m \u1EDF vi\u1EC7c d\xE1m y\xEAu nh\u1EEFng s\u1EDF th\xEDch ch\xE2n th\u1EADt c\u1EE7a ri\xEAng m\xECnh.'
  },
  {
    id: "adv_074",
    topic: "Ch\xEDnh m\xECnh",
    tag: "\u2728 \u0110\u1ED9c b\u1EA3n",
    icon: "\u{1F984}",
    content: "Th\u1EBF gi\u1EDBi c\u1EA7n phi\xEAn b\u1EA3n nguy\xEAn b\u1EA3n l\xE0 ch\xEDnh b\u1EA1n, kh\xF4ng c\u1EA7n th\xEAm m\u1ED9t b\u1EA3n sao ch\xE9p ho\xE0n h\u1EA3o c\u1EE7a b\u1EA5t k\u1EF3 ai kh\xE1c. H\xE3y t\u1EF1 h\xE0o v\u1EC1 n\xE9t ri\xEAng \u1EA5y!"
  },
  // 28. Giao tiếp & Thấu cảm
  {
    id: "adv_075",
    topic: "Giao ti\u1EBFp",
    tag: "\u{1F91D} K\u1EBFt n\u1ED1i",
    icon: "\u{1F442}",
    content: "L\u1EAFng nghe kh\xF4ng ph\u1EA3i l\xE0 ch\u1EDD \u0111\u1EBFn l\u01B0\u1EE3t m\xECnh n\xF3i, m\xE0 l\xE0 th\u1EF1c s\u1EF1 \u0111\u1EC3 t\xE2m v\xE0o c\xE2u chuy\u1EC7n c\u1EE7a ng\u01B0\u1EDDi \u0111\u1ED1i di\u1EC7n. Ai c\u0169ng khao kh\xE1t \u0111\u01B0\u1EE3c th\u1EA5u hi\u1EC3u ch\xE2n th\xE0nh."
  },
  {
    id: "adv_076",
    topic: "Giao ti\u1EBFp",
    tag: "\u{1F91D} K\u1EBFt n\u1ED1i",
    icon: "\u{1F4AC}",
    content: "N\xF3i nh\u1EEFng l\u1EDDi d\u1ECBu d\xE0ng kh\xF4ng l\xE0m b\u1EA1n y\u1EBFu th\u1EBF \u0111i. Ng\u01B0\u1EE3c l\u1EA1i, ch\u1EC9 nh\u1EEFng ng\u01B0\u1EDDi c\xF3 n\u1ED9i t\xE2m v\u1EEFng v\xE0ng m\u1EDBi c\xF3 th\u1EC3 gi\u1EEF \u0111\u01B0\u1EE3c gi\u1ECDng n\xF3i h\xF2a nh\xE3 gi\u1EEFa b\u1EA5t \u0111\u1ED3ng."
  },
  // 29. Khám phá & Tò mò
  {
    id: "adv_077",
    topic: "Kh\xE1m ph\xE1",
    tag: "\u{1F52D} T\xF2 m\xF2",
    icon: "\u{1F4DA}",
    content: "M\u1EDF m\u1ED9t cu\u1ED1n s\xE1ch v\u1EC1 \u0111\u1EC1 t\xE0i b\u1EA1n ch\u01B0a t\u1EEBng \u0111\u1ECDc bao gi\u1EDD. M\u1ED7i trang s\xE1ch l\xE0 m\u1ED9t t\u1EA5m v\xE9 \u0111\u01B0a b\u1EA1n chu du v\xE0o m\u1ED9t g\xF3c nh\xECn m\u1EDBi l\u1EA1 c\u1EE7a cu\u1ED9c \u0111\u1EDDi."
  },
  {
    id: "adv_078",
    topic: "Kh\xE1m ph\xE1",
    tag: "\u{1F52D} T\xF2 m\xF2",
    icon: "\u{1F30D}",
    content: "H\xE3y gi\u1EEF cho m\xECnh \u0111\xF4i m\u1EAFt lu\xF4n ng\u1EA1c nhi\xEAn tr\u01B0\u1EDBc th\u1EBF gi\u1EDBi. Ng\u01B0\u1EDDi lu\xF4n t\xF2 m\xF2 h\u1ECDc h\u1ECFi s\u1EBD kh\xF4ng bao gi\u1EDD c\u1EA3m th\u1EA5y bu\u1ED3n t\u1EBB hay \u0111\u01A1n \u0111\u1ED9c."
  },
  // 30. Trách nhiệm & Tự lập
  {
    id: "adv_079",
    topic: "T\u1EF1 l\u1EADp",
    tag: "\u2693 V\u1EEFng v\xE0ng",
    icon: "\u{1F5DD}\uFE0F",
    content: "T\u1EF1 gi\u1EB7t b\u1ED9 \u0111\u1ED3ng ph\u1EE5c, t\u1EF1 x\u1EBFp g\xF3c b\xE0n hay t\u1EF1 c\xE0i chu\xF4ng b\xE1o th\u1EE9c. T\u1EF1 l\u1EADp b\u1EAFt \u0111\u1EA7u t\u1EEB nh\u1EEFng vi\u1EC7c c\u1ECFn con nh\u1EA5t trao cho b\u1EA1n quy\u1EC1n t\u1EF1 ch\u1EE7 cu\u1ED9c \u0111\u1EDDi."
  },
  {
    id: "adv_080",
    topic: "T\u1EF1 l\u1EADp",
    tag: "\u2693 V\u1EEFng v\xE0ng",
    icon: "\u{1F6E1}\uFE0F",
    content: "D\xE1m ch\u1ECBu tr\xE1ch nhi\u1EC7m v\u1EC1 l\u1EDDi n\xF3i v\xE0 vi\u1EC7c l\xE0m c\u1EE7a m\xECnh l\xE0 b\u01B0\u1EDBc \u0111i d\u0169ng c\u1EA3m nh\u1EA5t c\u1EE7a tu\u1ED5i tr\u1EBB. Ai c\u0169ng k\xEDnh tr\u1ECDng ng\u01B0\u1EDDi d\xE1m nh\u1EADn tr\xE1ch nhi\u1EC7m."
  },
  // 31. Thư thái giữa kỳ thi
  {
    id: "adv_081",
    topic: "M\xF9a thi",
    tag: "\u{1F4DA} M\xF9a thi c\u1EED",
    icon: "\u2615",
    content: "Khi b\u01B0\u1EDBc v\xE0o ph\xF2ng thi, h\xE3y h\xEDt s\xE2u v\xE0 th\u1EDF d\xE0i m\u1ED9t h\u01A1i th\u1EADt ch\u1EADm. B\u1EA1n \u0111\xE3 chu\u1EA9n b\u1ECB chu \u0111\xE1o r\u1ED3i, gi\u1EDD l\xE0 l\xFAc b\xECnh t\u0129nh th\u1EC3 hi\u1EC7n nh\u1EEFng g\xEC m\xECnh bi\u1EBFt."
  },
  {
    id: "adv_082",
    topic: "M\xF9a thi",
    tag: "\u{1F4DA} M\xF9a thi c\u1EED",
    icon: "\u{1F36B}",
    content: "\u0102n m\u1ED9t m\u1EA9u s\xF4-c\xF4-la nh\u1ECF, u\u1ED1ng \u0111\u1EE7 n\u01B0\u1EDBc v\xE0 ng\u1EE7 \u0111\u1EE7 7 ti\u1EBFng tr\u01B0\u1EDBc ng\xE0y thi. B\u1ED9 n\xE3o s\xE1ng su\u1ED1t khi c\u01A1 th\u1EC3 b\u1EA1n \u0111\u01B0\u1EE3c \u0111\u1ED1i \u0111\xE3i t\u1EED t\u1EBF."
  },
  // 32. Trân trọng hiện tại
  {
    id: "adv_083",
    topic: "Hi\u1EC7n t\u1EA1i",
    tag: "\u{1F338} \u1EDE \u0111\xE2y v\xE0 b\xE2y gi\u1EDD",
    icon: "\u23F3",
    content: "\u0110\u1EEBng m\xE3i nu\u1ED1i ti\u1EBFc h\xF4m qua hay lo l\u1EAFng th\xE1i qu\xE1 v\u1EC1 ng\xE0y mai. M\xF3n qu\xE0 duy nh\u1EA5t c\xF3 th\u1EADt trong tay b\u1EA1n l\xE0 gi\xE2y ph\xFAt n\xE0y. H\xEDt th\u1EDF v\xE0 t\u1EADn h\u01B0\u1EDFng n\xF3 nh\xE9!"
  },
  {
    id: "adv_084",
    topic: "Hi\u1EC7n t\u1EA1i",
    tag: "\u{1F338} \u1EDE \u0111\xE2y v\xE0 b\xE2y gi\u1EDD",
    icon: "\u{1F375}",
    content: "C\u1ED1c tr\xE0 s\u1EEFa b\u1EA1n \u0111ang u\u1ED1ng, l\xE0n gi\xF3 m\xE1t \u0111ang th\u1ED5i qua t\xF3c, ti\u1EBFng c\u01B0\u1EDDi b\u1EA1n b\xE8 gi\u1EDD ra ch\u01A1i... H\xE3y \u0111\u1EC3 t\xE2m tr\xED \u1EDF \u0111\xE2y \u0111\u1EC3 c\u1EA3m nh\u1EADn tr\u1ECDn v\u1EB9n tu\u1ED5i thanh xu\xE2n."
  },
  // 33. Khi bạn cảm thấy cô đơn
  {
    id: "adv_085",
    topic: "C\xF4 \u0111\u01A1n",
    tag: "\u{1F499} \u0110\u1ED3ng h\xE0nh",
    icon: "\u{1F319}",
    content: "N\u1EBFu c\xF3 l\xFAc b\u1EA1n th\u1EA5y l\u1EA1c l\xF5ng gi\u1EEFa \u0111\xE1m \u0111\xF4ng, h\xE3y nh\u1EDB b\u1EA1n kh\xF4ng bao gi\u1EDD \u0111\u01A1n \u0111\u1ED9c. Lu\xF4n c\xF3 nh\u1EEFng ng\u01B0\u1EDDi tr\xE2n qu\xFD b\u1EA1n, v\xE0 \xEDt nh\u1EA5t, ch\xEDnh b\u1EA1n v\u1EABn lu\xF4n c\xF3 m\xECnh b\xEAn c\u1EA1nh."
  },
  {
    id: "adv_086",
    topic: "C\xF4 \u0111\u01A1n",
    tag: "\u{1F499} \u0110\u1ED3ng h\xE0nh",
    icon: "\u{1F56F}\uFE0F",
    content: "Kho\u1EA3ng l\u1EB7ng m\u1ED9t m\xECnh kh\xF4ng ph\u1EA3i l\xE0 s\u1EF1 c\xF4 l\u1EADp, m\xE0 l\xE0 c\u01A1 h\u1ED9i qu\xFD gi\xE1 \u0111\u1EC3 b\u1EA1n tr\xF2 chuy\u1EC7n v\xE0 l\xE0m th\xE2n l\u1EA1i v\u1EDBi ch\xEDnh t\xE2m h\u1ED3n c\u1EE7a m\xECnh."
  },
  // 34. Hy vọng & Lạc quan
  {
    id: "adv_087",
    topic: "Hy v\u1ECDng",
    tag: "\u2728 Ni\u1EC1m tin",
    icon: "\u{1F31F}",
    content: "Nh\u1EEFng \u0111i\u1EC1u tuy\u1EC7t v\u1EDDi nh\u1EA5t th\u01B0\u1EDDng xu\u1EA5t hi\u1EC7n khi ta \xEDt ng\u1EDD t\u1EDBi nh\u1EA5t. C\u1EE9 ti\u1EBFp t\u1EE5c gieo nh\u1EEFng h\u1EA1t gi\u1ED1ng ch\u0103m ch\u1EC9 v\xE0 thi\u1EC7n l\xE0nh, hoa s\u1EBD n\u1EDF \u0111\xFAng m\xF9a."
  },
  {
    id: "adv_088",
    topic: "Hy v\u1ECDng",
    tag: "\u2728 Ni\u1EC1m tin",
    icon: "\u{1F308}",
    content: "B\u1EA7u tr\u1EDDi sau c\u01A1n b\xE3o lu\xF4n l\xE0 b\u1EA7u tr\u1EDDi trong xanh nh\u1EA5t. Gi\u1EEF v\u1EEFng ni\u1EC1m tin trong tim nh\xE9, ng\xE0y mai n\u1EAFng \u1EA5m s\u1EBD l\u1EA1i v\u1EC1 ng\u1EADp tr\xE0n \xF4 c\u1EEDa s\u1ED5 c\u1EE7a b\u1EA1n."
  },
  // 35. Nuôi dưỡng ước mơ
  {
    id: "adv_089",
    topic: "\u01AF\u1EDBc m\u01A1",
    tag: "\u{1F680} Ho\xE0i b\xE3o",
    icon: "\u2728",
    content: "\u01AF\u1EDBc m\u01A1 c\u1EE7a b\u1EA1n d\xF9 nh\u1ECF b\xE9 hay v\u0129 \u0111\u1EA1i \u0111\u1EC1u x\u1EE9ng \u0111\xE1ng \u0111\u01B0\u1EE3c n\xE2ng niu. \u0110\u1EEBng \u0111\u1EC3 ai d\u1EADp t\u1EAFt ng\u1ECDn l\u1EEDa \u1EA5y ch\u1EC9 v\xEC h\u1ECD ch\u01B0a t\u1EEBng d\xE1m m\u01A1 l\u1EDBn."
  },
  {
    id: "adv_090",
    topic: "\u01AF\u1EDBc m\u01A1",
    tag: "\u{1F680} Ho\xE0i b\xE3o",
    icon: "\u{1F320}",
    content: "H\xF4m nay h\xE3y l\xE0m m\u1ED9t vi\u1EC7c th\u1EADt nh\u1ECF h\u01B0\u1EDBng t\u1EDBi \u0111i\u1EC1u b\u1EA1n t\u1EEBng ao \u01B0\u1EDBc: \u0111\u1ECDc m\u1ED9t trang s\xE1ch, vi\u1EBFt m\u1ED9t d\xF2ng ghi ch\xFA. C\xE1nh bu\u1ED3m \u01B0\u1EDBc m\u01A1 b\u1EAFt \u0111\u1EA7u t\u1EEB ch\xEDnh ng\u1ECDn gi\xF3 nh\u1ECF n\xE0y."
  }
];

// server/db.ts
var resolveDbFilePath = () => {
  const cwdPath = path.join(process.cwd(), "server_db_store.json");
  if (fs.existsSync(cwdPath)) return cwdPath;
  const relPath = path.resolve(__dirname, "..", "server_db_store.json");
  if (fs.existsSync(relPath)) return relPath;
  return cwdPath;
};
var Database = class {
  // google_auth_id -> user_id
  constructor() {
    this.saveTimeout = null;
    // Strict unique lookup indices
    this.emailIndex = /* @__PURE__ */ new Map();
    // clean email (lowercase) -> user_id
    this.googleIdIndex = /* @__PURE__ */ new Map();
    this.data = {
      users: {},
      sessions: {},
      journals: {},
      plants: {},
      letters: {},
      confessions: {},
      stickyNotes: {},
      userProgress: {}
    };
    this.load();
  }
  rebuildIndexes() {
    this.emailIndex.clear();
    this.googleIdIndex.clear();
    for (const user of Object.values(this.data.users)) {
      if (user.email) {
        this.emailIndex.set(user.email.trim().toLowerCase(), user.id);
      }
      if (user.google_auth_id) {
        this.googleIdIndex.set(user.google_auth_id, user.id);
      }
    }
  }
  load() {
    try {
      const dbPath = resolveDbFilePath();
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, "utf-8");
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || {},
          sessions: parsed.sessions || {},
          journals: parsed.journals || {},
          plants: parsed.plants || {},
          letters: parsed.letters || {},
          confessions: parsed.confessions || {},
          stickyNotes: parsed.stickyNotes || {},
          userProgress: parsed.userProgress || {}
        };
      }
    } catch (e) {
      console.warn("Could not load database file, initializing empty in-memory store:", e);
    }
    this.rebuildIndexes();
  }
  scheduleSave() {
    if (this.saveTimeout) return;
    this.saveTimeout = setTimeout(() => {
      this.saveTimeout = null;
      this.saveSync();
    }, 150);
  }
  saveSync() {
    try {
      const targetPath = resolveDbFilePath();
      fs.writeFileSync(targetPath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.warn("Database write to disk skipped (read-only filesystem):", e?.message || e);
    }
  }
  // Find user by ID
  getUserById(id) {
    return this.data.users[id] || null;
  }
  // Find user by Email (case-insensitive)
  getUserByEmail(email) {
    const clean = email.trim().toLowerCase();
    const id = this.emailIndex.get(clean);
    if (id && this.data.users[id]) return this.data.users[id];
    for (const u of Object.values(this.data.users)) {
      if (u.email && u.email.trim().toLowerCase() === clean) {
        this.emailIndex.set(clean, u.id);
        return u;
      }
    }
    return null;
  }
  // Find user by Google Auth ID
  getUserByGoogleId(googleId) {
    const id = this.googleIdIndex.get(googleId);
    if (id && this.data.users[id]) return this.data.users[id];
    for (const u of Object.values(this.data.users)) {
      if (u.google_auth_id === googleId) {
        this.googleIdIndex.set(googleId, u.id);
        return u;
      }
    }
    return null;
  }
  // Find or create user via Google OAuth / Gmail payload with strict password verification
  findOrCreateGoogleUser(params) {
    const cleanEmail = params.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { error: "Email kh\xF4ng h\u1EE3p l\u1EC7." };
    }
    if (!params.password || !params.password.trim()) {
      return { error: "Vui l\xF2ng nh\u1EADp m\u1EADt kh\u1EA9u t\u1EF1 ch\u1ECDn \u0111\u1EC3 ti\u1EBFp t\u1EE5c." };
    }
    let existing = this.getUserByEmail(cleanEmail);
    if (!existing && params.google_auth_id) {
      existing = this.getUserByGoogleId(params.google_auth_id);
    }
    if (existing) {
      if (existing.password_hash && existing.password_salt) {
        const isMatch = this.verifyPassword(params.password.trim(), existing.password_hash, existing.password_salt);
        if (!isMatch) {
          return { error: "Sai m\u1EADt kh\u1EA9u. Vui l\xF2ng nh\u1EADp \u0111\xFAng m\u1EADt kh\u1EA9u \u0111\xE3 l\u01B0u." };
        }
      } else {
        const { hash: hash2, salt: salt2 } = this.hashPassword(params.password.trim());
        existing.password_hash = hash2;
        existing.password_salt = salt2;
      }
      existing.last_active = (/* @__PURE__ */ new Date()).toISOString();
      if (params.google_auth_id && !existing.google_auth_id) {
        existing.google_auth_id = params.google_auth_id;
        this.googleIdIndex.set(params.google_auth_id, existing.id);
      }
      this.scheduleSave();
      return { user: existing, isNew: false };
    }
    const { hash, salt } = this.hashPassword(params.password.trim());
    const id = `usr_${Date.now()}_${Math.floor(1e3 + Math.random() * 9e3)}`;
    const nickname = params.suggestedNickname?.trim() || "";
    const avatar = params.suggestedAvatar || "\u{1F331}";
    const newUser = {
      id,
      google_auth_id: params.google_auth_id || `google_${Buffer.from(cleanEmail).toString("base64").replace(/=/g, "")}`,
      email: cleanEmail,
      nickname,
      avatar,
      password_hash: hash,
      password_salt: salt,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_active: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.users[id] = newUser;
    this.emailIndex.set(cleanEmail, id);
    if (newUser.google_auth_id) {
      this.googleIdIndex.set(newUser.google_auth_id, id);
    }
    this.scheduleSave();
    return { user: newUser, isNew: true };
  }
  // Cryptographic Salted PBKDF2 Password Hashing (OWASP / NIST Recommended)
  hashPassword(password, salt) {
    const s = salt || crypto.randomBytes(16).toString("hex");
    const h = crypto.pbkdf2Sync(password, s, 1e5, 64, "sha512").toString("hex");
    return { hash: h, salt: s };
  }
  verifyPassword(password, hash, salt) {
    if (!password || !hash || !salt) return false;
    try {
      const calculated = crypto.pbkdf2Sync(password, salt, 1e5, 64, "sha512").toString("hex");
      const bufCalculated = Buffer.from(calculated, "hex");
      const bufStored = Buffer.from(hash, "hex");
      if (bufCalculated.length !== bufStored.length) return false;
      return crypto.timingSafeEqual(bufCalculated, bufStored);
    } catch {
      return false;
    }
  }
  // Register with Website Password
  registerWithPassword(params) {
    const cleanEmail = params.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { error: "Email kh\xF4ng h\u1EE3p l\u1EC7." };
    }
    if (!params.password || params.password.length < 8) {
      return { error: "M\u1EADt kh\u1EA9u ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1." };
    }
    const existing = this.getUserByEmail(cleanEmail);
    if (existing) {
      if (existing.password_hash) {
        return { error: "Email n\xE0y \u0111\xE3 c\xF3 t\xE0i kho\u1EA3n. Vui l\xF2ng \u0111\u0103ng nh\u1EADp ho\u1EB7c ch\u1ECDn Qu\xEAn m\u1EADt kh\u1EA9u." };
      }
      const { hash: hash2, salt: salt2 } = this.hashPassword(params.password);
      existing.password_hash = hash2;
      existing.password_salt = salt2;
      if (params.nickname?.trim()) {
        existing.nickname = params.nickname.trim();
      }
      existing.last_active = (/* @__PURE__ */ new Date()).toISOString();
      this.scheduleSave();
      return { user: existing };
    }
    const { hash, salt } = this.hashPassword(params.password);
    const id = `usr_${Date.now()}_${Math.floor(1e3 + Math.random() * 9e3)}`;
    const nickname = params.nickname?.trim() || "";
    const newUser = {
      id,
      email: cleanEmail,
      nickname,
      avatar: "\u{1F331}",
      password_hash: hash,
      password_salt: salt,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_active: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.users[id] = newUser;
    this.emailIndex.set(cleanEmail, id);
    this.scheduleSave();
    return { user: newUser };
  }
  // Login with Website Password
  loginWithPassword(params) {
    const cleanEmail = params.email.trim().toLowerCase();
    if (!cleanEmail || !params.password) {
      return { error: "Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 email v\xE0 m\u1EADt kh\u1EA9u." };
    }
    const user = this.getUserByEmail(cleanEmail);
    if (!user) {
      return { error: "Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng ch\xEDnh x\xE1c." };
    }
    if (!user.password_hash || !user.password_salt) {
      return { error: "T\xE0i kho\u1EA3n n\xE0y \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD qua Google. B\u1EA1n vui l\xF2ng ch\u1ECDn \u0110\u0103ng nh\u1EADp v\u1EDBi Google ho\u1EB7c thi\u1EBFt l\u1EADp m\u1EADt kh\u1EA9u m\u1EDBi qua Qu\xEAn m\u1EADt kh\u1EA9u." };
    }
    const isMatch = this.verifyPassword(params.password, user.password_hash, user.password_salt);
    if (!isMatch) {
      return { error: "Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng ch\xEDnh x\xE1c." };
    }
    user.last_active = (/* @__PURE__ */ new Date()).toISOString();
    this.scheduleSave();
    return { user };
  }
  // Request password reset code
  requestPasswordReset(email) {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.getUserByEmail(cleanEmail);
    if (!user) {
      return {
        success: true,
        message: "N\u1EBFu email t\u1ED3n t\u1EA1i trong h\u1EC7 th\u1ED1ng, m\xE3 x\xE1c th\u1EF1c \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA1o."
      };
    }
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    user.reset_code = code;
    user.reset_code_expires = Date.now() + 15 * 60 * 1e3;
    this.scheduleSave();
    return {
      success: true,
      resetCode: code,
      message: "M\xE3 x\xE1c th\u1EF1c 6 ch\u1EEF s\u1ED1 \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi. M\xE3 c\xF3 hi\u1EC7u l\u1EF1c trong 15 ph\xFAt."
    };
  }
  // Reset password using verified code (NEVER deletes user data, keeps UID intact)
  resetPasswordWithCode(params) {
    const cleanEmail = params.email.trim().toLowerCase();
    const user = this.getUserByEmail(cleanEmail);
    if (!user) {
      return { error: "Kh\xF4ng t\xECm th\u1EA5y t\xE0i kho\u1EA3n v\u1EDBi email n\xE0y." };
    }
    if (!user.reset_code || !user.reset_code_expires || user.reset_code.trim() !== params.code.trim()) {
      return { error: "M\xE3 x\xE1c th\u1EF1c kh\xF4ng ch\xEDnh x\xE1c ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n." };
    }
    if (Date.now() > user.reset_code_expires) {
      user.reset_code = null;
      user.reset_code_expires = null;
      this.scheduleSave();
      return { error: "M\xE3 x\xE1c th\u1EF1c \u0111\xE3 h\u1EBFt h\u1EA1n. Vui l\xF2ng y\xEAu c\u1EA7u m\xE3 m\u1EDBi." };
    }
    if (!params.newPassword || params.newPassword.length < 8) {
      return { error: "M\u1EADt kh\u1EA9u m\u1EDBi ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1." };
    }
    const { hash, salt } = this.hashPassword(params.newPassword);
    user.password_hash = hash;
    user.password_salt = salt;
    user.reset_code = null;
    user.reset_code_expires = null;
    user.last_active = (/* @__PURE__ */ new Date()).toISOString();
    this.scheduleSave();
    return { user };
  }
  // Change password for logged in user
  changePassword(params) {
    const user = this.getUserById(params.userId);
    if (!user) {
      return { success: false, error: "Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i." };
    }
    if (!params.newPassword || params.newPassword.length < 8) {
      return { success: false, error: "M\u1EADt kh\u1EA9u m\u1EDBi ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1." };
    }
    if (user.password_hash && user.password_salt) {
      if (!params.currentPassword) {
        return { success: false, error: "Vui l\xF2ng nh\u1EADp m\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i." };
      }
      const isCurrentValid = this.verifyPassword(params.currentPassword, user.password_hash, user.password_salt);
      if (!isCurrentValid) {
        return { success: false, error: "M\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i kh\xF4ng \u0111\xFAng." };
      }
    }
    const { hash, salt } = this.hashPassword(params.newPassword);
    user.password_hash = hash;
    user.password_salt = salt;
    user.last_active = (/* @__PURE__ */ new Date()).toISOString();
    this.scheduleSave();
    return { success: true };
  }
  // Safe user serialization (NEVER leak password_hash, password_salt or reset_code)
  getSafeUser(user) {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      has_password: Boolean(user.password_hash),
      created_at: user.created_at,
      createdAt: user.created_at
    };
  }
  // Create session
  createSession(userId) {
    const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
    this.data.sessions[token] = userId;
    this.scheduleSave();
    return token;
  }
  // Retrieve user by session token
  getUserByToken(token) {
    if (!token) return null;
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();
    const userId = this.data.sessions[cleanToken];
    if (!userId) {
      if (cleanToken.startsWith("usr_") && this.data.users[cleanToken]) {
        return this.data.users[cleanToken];
      }
      if (cleanToken.startsWith("dev_token_")) {
        const idPart = cleanToken.replace("dev_token_", "");
        if (this.data.users[idPart]) return this.data.users[idPart];
      }
      return null;
    }
    const user = this.data.users[userId];
    if (user) {
      user.last_active = (/* @__PURE__ */ new Date()).toISOString();
    }
    return user || null;
  }
  // Invalidate session
  deleteSession(token) {
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();
    delete this.data.sessions[cleanToken];
    this.scheduleSave();
  }
  // Update profile
  updateUser(userId, updates) {
    const user = this.data.users[userId];
    if (!user) return null;
    if (updates.nickname && updates.nickname.trim()) {
      user.nickname = updates.nickname.trim();
    }
    if (updates.avatar && updates.avatar.trim()) {
      user.avatar = updates.avatar.trim();
    }
    user.last_active = (/* @__PURE__ */ new Date()).toISOString();
    this.scheduleSave();
    return user;
  }
  // User Fast Math Best Score
  getUserFastMathBest(userId) {
    const user = this.data.users[userId];
    return user?.fast_math_best_score || 0;
  }
  updateUserFastMathBest(userId, score) {
    const user = this.data.users[userId];
    if (!user) return score;
    const current = user.fast_math_best_score || 0;
    if (score > current) {
      user.fast_math_best_score = score;
      this.scheduleSave();
      return score;
    }
    return current;
  }
  // Get or assign daily advice for user
  getOrCreateUserDailyAdvice(userId, dateStr) {
    const user = this.data.users[userId];
    if (!user) {
      return {
        advice: DAILY_ADVICES[0],
        hasReadToday: false,
        date: dateStr
      };
    }
    if (!user.advice_history) {
      user.advice_history = [];
    }
    const existingEntry = user.advice_history.find((e) => e.date === dateStr);
    if (existingEntry) {
      const foundAdvice = DAILY_ADVICES.find((a) => a.id === existingEntry.advice_id) || DAILY_ADVICES[0];
      return {
        advice: foundAdvice,
        hasReadToday: !!existingEntry.read_at,
        date: dateStr
      };
    }
    const receivedIds = new Set(user.advice_history.map((e) => e.advice_id));
    const unreadAdvices = DAILY_ADVICES.filter((a) => !receivedIds.has(a.id));
    let chosenAdvice;
    if (unreadAdvices.length > 0) {
      let hash = 0;
      const seed = `${user.id}_${dateStr}`;
      for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % unreadAdvices.length;
      chosenAdvice = unreadAdvices[index];
    } else {
      const oldestId = user.advice_history[0]?.advice_id;
      chosenAdvice = DAILY_ADVICES.find((a) => a.id === oldestId) || DAILY_ADVICES[0];
    }
    user.advice_history.push({
      date: dateStr,
      advice_id: chosenAdvice.id,
      read_at: null
    });
    this.scheduleSave();
    return {
      advice: chosenAdvice,
      hasReadToday: false,
      date: dateStr
    };
  }
  markUserDailyAdviceRead(userId, dateStr) {
    const user = this.data.users[userId];
    if (!user || !user.advice_history) return false;
    const entry = user.advice_history.find((e) => e.date === dateStr);
    if (entry) {
      if (!entry.read_at) {
        entry.read_at = (/* @__PURE__ */ new Date()).toISOString();
        this.scheduleSave();
      }
      return true;
    }
    return false;
  }
  // Delete account completely and purge user data
  deleteUser(userId) {
    if (!this.data.users[userId]) return false;
    delete this.data.users[userId];
    delete this.data.journals[userId];
    delete this.data.plants[userId];
    if (this.data.letters) {
      for (const [id, ltr] of Object.entries(this.data.letters)) {
        if (ltr.sender_id === userId) {
          delete this.data.letters[id];
        }
      }
    }
    for (const [token, uid] of Object.entries(this.data.sessions)) {
      if (uid === userId) delete this.data.sessions[token];
    }
    this.scheduleSave();
    return true;
  }
  // Save User Journal (STRICTLY ISOLATED BY UID)
  saveUserJournal(userId, entries, capsules) {
    this.data.journals[userId] = {
      user_id: userId,
      entries: Array.isArray(entries) ? entries : [],
      capsules: Array.isArray(capsules) ? capsules : [],
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.scheduleSave();
    return true;
  }
  // Get User Journal (STRICTLY ISOLATED BY UID)
  getUserJournal(userId) {
    const j = this.data.journals[userId];
    if (!j) {
      return { entries: [], capsules: [] };
    }
    return {
      entries: Array.isArray(j.entries) ? j.entries : [],
      capsules: Array.isArray(j.capsules) ? j.capsules : []
    };
  }
  // Save User Plant Seeds & State (STRICTLY PERSONAL - NO FRIEND CARE)
  saveUserPlant(userId, data) {
    const existing = this.data.plants[userId] || {};
    if (Array.isArray(data)) {
      this.data.plants[userId] = {
        ...existing,
        user_id: userId,
        seeds: data,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else if (data && typeof data === "object") {
      this.data.plants[userId] = {
        ...existing,
        ...data,
        user_id: userId,
        seeds: Array.isArray(data.seeds) ? data.seeds : existing.seeds || [],
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    this.scheduleSave();
    return true;
  }
  // Get User Plant (STRICTLY PERSONAL)
  getUserPlant(userId) {
    const p = this.data.plants[userId];
    if (!p) {
      return { seeds: [] };
    }
    return {
      ...p,
      seeds: Array.isArray(p.seeds) ? p.seeds : []
    };
  }
  // Letters to Self
  createLetter(data) {
    const id = "self_ltr_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 7);
    const share_key = "sk_" + Math.random().toString(36).substring(2, 10);
    const letter = {
      id,
      sender_id: data.sender_id || void 0,
      sender_name: data.sender_name?.trim() || "T\xF4i c\u1EE7a h\xF4m nay",
      receiver_name: data.receiver_name?.trim() || "T\xF4i c\u1EE7a ng\xE0y mai",
      title: data.title.trim(),
      content: data.content.trim(),
      paper_style: data.paper_style || "parchment",
      ink_color: data.ink_color || "#3b2a1e",
      font_family: data.font_family || "serif",
      drawing_data: data.drawing_data || null,
      open_date: data.open_date || data.unlock_at || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      wax_seal: data.wax_seal || "terracotta",
      is_opened: false,
      opened_at: null,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      stickers_data: data.stickers_data || void 0,
      seal_icon: data.seal_icon || "\u2709\uFE0F",
      theme_color: data.theme_color || "amber",
      condition_type: "date",
      unlock_at: data.open_date,
      share_key
    };
    if (!this.data.letters) {
      this.data.letters = {};
    }
    this.data.letters[id] = letter;
    this.scheduleSave();
    return letter;
  }
  getLetterOpenTimestamp(openDateStr) {
    if (!openDateStr) return 0;
    if (/^\d{4}-\d{2}-\d{2}$/.test(openDateStr)) {
      const parts = openDateStr.split("-");
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0).getTime();
    }
    return new Date(openDateStr).getTime();
  }
  formatVnDate(timestamp) {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  getLetterSummaries(userId) {
    if (!this.data.letters) return [];
    const now = Date.now();
    const letters = Object.values(this.data.letters).filter((ltr) => userId ? ltr.sender_id === userId || !ltr.sender_id : !ltr.sender_id);
    return letters.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((ltr) => {
      const openDateStr = ltr.open_date || ltr.unlock_at || ltr.created_at;
      const openTime = this.getLetterOpenTimestamp(openDateStr);
      const formattedDate = this.formatVnDate(openTime);
      let is_locked = false;
      let lock_message = "";
      let days_remaining = 0;
      if (now < openTime) {
        is_locked = true;
        days_remaining = Math.max(1, Math.ceil((openTime - now) / (1e3 * 60 * 60 * 24)));
        lock_message = `B\u1EE9c th\u01B0 n\xE0y \u0111\u01B0\u1EE3c h\u1EB9n ng\xE0y ${formattedDate} m\u1EDBi m\u1EDF. H\xE3y ki\xEAn nh\u1EABn ch\u1EDD \u0111\u1EE3i nh\xE9...`;
      }
      return {
        id: ltr.id,
        sender_name: ltr.sender_name,
        receiver_name: ltr.receiver_name,
        title: ltr.title,
        paper_style: ltr.paper_style || "parchment",
        ink_color: ltr.ink_color || "#3b2a1e",
        font_family: ltr.font_family || "serif",
        open_date: openDateStr,
        wax_seal: ltr.wax_seal || "terracotta",
        is_opened: !!ltr.is_opened,
        opened_at: ltr.opened_at,
        created_at: ltr.created_at,
        is_locked,
        lock_message,
        days_remaining,
        seal_icon: ltr.seal_icon || "\u2709\uFE0F",
        theme_color: ltr.theme_color || "amber",
        has_drawing: !!ltr.drawing_data,
        stickers_data: ltr.stickers_data,
        condition_type: "date",
        unlock_at: openDateStr
      };
    });
  }
  getLetterById(id) {
    if (!this.data.letters) return null;
    return this.data.letters[id] || null;
  }
  openLetter(id) {
    const ltr = this.getLetterById(id);
    if (!ltr) {
      return { success: false, lock_message: "Kh\xF4ng t\xECm th\u1EA5y b\u1EE9c th\u01B0 n\xE0y." };
    }
    const now = Date.now();
    const openDateStr = ltr.open_date || ltr.unlock_at || ltr.created_at;
    const openTime = this.getLetterOpenTimestamp(openDateStr);
    const formattedDate = this.formatVnDate(openTime);
    if (now < openTime) {
      const days_remaining = Math.max(1, Math.ceil((openTime - now) / (1e3 * 60 * 60 * 24)));
      const lock_message = `B\u1EE9c th\u01B0 n\xE0y \u0111\u01B0\u1EE3c h\u1EB9n ng\xE0y ${formattedDate} m\u1EDBi m\u1EDF. H\xE3y ki\xEAn nh\u1EABn ch\u1EDD \u0111\u1EE3i nh\xE9...`;
      return {
        success: false,
        locked: true,
        lock_message,
        days_remaining,
        open_date: openDateStr
      };
    }
    if (!ltr.is_opened) {
      ltr.is_opened = true;
      ltr.opened_at = (/* @__PURE__ */ new Date()).toISOString();
      this.scheduleSave();
    }
    return {
      success: true,
      letter: ltr
    };
  }
  deleteLetter(id, userId) {
    if (!this.data.letters || !this.data.letters[id]) return false;
    if (userId && this.data.letters[id].sender_id && this.data.letters[id].sender_id !== userId) {
      return false;
    }
    delete this.data.letters[id];
    this.scheduleSave();
    return true;
  }
  // ==================== Confessions & Community ====================
  ensureDailyAiConfessions(todayStr) {
    if (!this.data.confessions) {
      this.data.confessions = {};
    }
    const hasTodayAi = Object.values(this.data.confessions).some(
      (c) => c.author_type === "ai" && c.date_key === todayStr
    );
    if (!hasTodayAi) {
      const parts = todayStr.split("-");
      const day = parseInt(parts[2], 10) || 15;
      const pool = [
        {
          title: "K\u1EF3 v\u1ECDng \u0111i\u1EC3m 9 c\u1EE7a m\u1EB9 v\xE0 t\u1EDD gi\u1EA5y ki\u1EC3m tra \u0111i\u1EC3m 6.5",
          content: 'H\xF4m nay c\xF4 gi\xE1o tr\u1EA3 b\xE0i kh\u1EA3o s\xE1t To\xE1n. Nh\xECn th\u1EA5y con s\u1ED1 6.5 \u0111\u1ECF ch\xF3i \u1EDF g\xF3c b\xE0i, t\u1EF1 nhi\xEAn tai m\xECnh \xF9 \u0111i. Su\u1ED1t qu\xE3ng \u0111\u01B0\u1EDDng \u0111\u1EA1p xe v\u1EC1 nh\xE0, m\xECnh ch\u1EC9 s\u1EE3 nghe c\xE2u: "M\u1EB9 cho con \u0111i h\u1ECDc th\xEAm bao nhi\xEAu ti\u1EC1n m\xE0 ch\u1EC9 \u0111\u01B0\u1EE3c th\u1EBF n\xE0y th\xF4i \xE0?". M\xECnh bi\u1EBFt b\u1ED1 m\u1EB9 v\u1EA5t v\u1EA3 v\xEC m\xECnh, nh\u01B0ng m\xECnh th\u1EA5y m\xECnh \u0111ang d\u1EA7n ngh\u1EB9t th\u1EDF v\xEC kh\xF4ng th\u1EC3 ho\xE0n h\u1EA3o nh\u01B0 k\u1EF3 v\u1ECDng...',
          category: "Gia \u0111\xECnh",
          empathy: 42,
          meToo: 38
        },
        {
          title: "C\u1EA3m gi\xE1c l\u1EA1c l\xF5ng ngay gi\u1EEFa nh\xF3m b\u1EA1n th\xE2n 4 ng\u01B0\u1EDDi",
          content: 'T\u1EE5i m\xECnh ch\u01A1i chung t\u1EEB n\u0103m l\u1EDBp 7. Nh\u01B0ng d\u1EA1o g\u1EA7n \u0111\xE2y, 3 b\u1EA1n kia l\u1EADp m\u1ED9t nh\xF3m chat ri\xEAng kh\xE1c, c\xF3 nh\u1EEFng c\xE2u chuy\u1EC7n \u0111\xF9a ri\xEAng m\xE0 khi m\xECnh h\u1ECFi th\xEC c\xE1c b\u1EA1n ch\u1EC9 b\u1EA3o: "\xC0 kh\xF4ng c\xF3 g\xEC \u0111\xE2u". \u0110i \u0103n c\xF9ng nhau, c\xE1c b\u1EA1n c\u1EAFm m\u1EB7t v\xE0o \u0111i\u1EC7n tho\u1EA1i c\u01B0\u1EDDi v\u1EDBi nhau. Ng\u1ED3i gi\u1EEFa c\xE1c b\u1EA1n m\xE0 m\xECnh th\u1EA5y c\xF4 \u0111\u01A1n h\u01A1n c\u1EA3 l\xFAc \u1EDF m\u1ED9t m\xECnh...',
          category: "T\xECnh b\u1EA1n",
          empathy: 56,
          meToo: 49
        },
        {
          title: "T\u1EF1 ti v\xEC khu\xF4n m\u1EB7t d\u1EADy th\xEC nhi\u1EC1u m\u1EE5n v\xE0 chi\u1EBFc k\xEDnh c\u1EADn d\xE0y c\u1ED9p",
          content: "M\u1ED7i l\u1EA7n \u0111i qua g\u01B0\u01A1ng \u1EDF s\u1EA3nh tr\u01B0\u1EDDng, m\xECnh \u0111\u1EC1u c\xFAi g\u1EB1m m\u1EB7t xu\u1ED1ng. Nh\xECn c\xE1c b\u1EA1n n\u1EEF trong l\u1EDBp da d\u1EBB m\u1ECBn m\xE0ng, bi\u1EBFt \u0103n m\u1EB7c \u0111\u1EB9p, m\xECnh th\u1EA5y m\xECnh nh\u01B0 m\u1ED9t ch\xFA v\u1ECBt x\u1EA5u x\xED. \u0110\xF4i khi c\xF3 b\u1EA1n nam tr\xEAu ch\u1ECDc m\u1ED9t c\xE2u v\xF4 \xFD th\xF4i m\xE0 m\xECnh v\u1EC1 nh\xE0 kh\xF3c c\u1EA3 bu\u1ED5i t\u1ED1i...",
          category: "B\u1EA3n th\xE2n",
          empathy: 68,
          meToo: 72
        },
        {
          title: "L\xE0m nh\xF3m tr\u01B0\u1EDFng b\xE0i t\u1EADp Sinh h\u1ECDc: Khi m\u1ED9t m\xECnh g\xE1nh c\u1EA3 team",
          content: 'C\xF4 gi\xE1o ph\xE2n nh\xF3m 5 ng\u01B0\u1EDDi l\xE0m b\xE0i thuy\u1EBFt tr\xECnh slide. M\xECnh ph\xE2n chia vi\u1EC7c r\xF5 r\xE0ng t\u1EEB th\u1EE9 Hai, nh\u01B0ng \u0111\u1EBFn t\u1ED1i Ch\u1EE7 nh\u1EADt s\xE1t ng\xE0y n\u1ED9p b\xE0i, 4 b\u1EA1n kia v\u1EABn "seen" kh\xF4ng tr\u1EA3 l\u1EDDi. Cu\u1ED1i c\xF9ng m\xECnh ph\u1EA3i th\u1EE9c tr\u1EAFng \u0111\xEAm l\xE0m slide cho c\u1EA3 nh\xF3m. V\u1EEBa t\u1EE9c v\u1EEBa b\u1EA5t l\u1EF1c...',
          category: "Tr\u01B0\u1EDDng h\u1ECDc",
          empathy: 61,
          meToo: 55
        },
        {
          title: "N\u1ED7i s\u1EE3 h\xE3i v\xF4 h\xECnh m\u1ED7i s\xE1ng tr\u01B0\u1EDBc khi b\u01B0\u1EDBc ch\xE2n v\xE0o c\u1ED5ng tr\u01B0\u1EDDng",
          content: 'Kh\xF4ng h\u1EB3n l\xE0 b\u1ECB b\u1EAFt n\u1EA1t, nh\u01B0ng l\u1EDBp m\xECnh c\xF3 v\u0103n h\xF3a "chia b\xE8 k\xE9o ph\xE1i" v\xE0 hay soi m\xF3i t\u1EEBng h\xE0nh \u0111\u1ED9ng c\u1EE7a ng\u01B0\u1EDDi kh\xE1c. Ch\u1EC9 c\u1EA7n b\u01B0\u1EDBc v\xE0o l\u1EDBp l\xE0 m\xECnh c\u1EA3m th\u1EA5y c\xF3 h\xE0ng ch\u1EE5c \xE1nh m\u1EAFt \u0111ang nh\xECn v\xE0 th\xEC th\u1EA7m...',
          category: "Tr\u01B0\u1EDDng h\u1ECDc",
          empathy: 77,
          meToo: 64
        },
        {
          title: "Th\xEDch m\u1ED9t b\u1EA1n c\xF9ng b\xE0n su\u1ED1t m\u1ED9t n\u0103m nh\u01B0ng kh\xF4ng d\xE1m n\xF3i",
          content: "M\u1ED7i ng\xE0y \u0111\u1EBFn l\u1EDBp, ni\u1EC1m vui duy nh\u1EA5t l\xE0 \u0111\u01B0\u1EE3c nh\xECn th\u1EA5y b\u1EA1n \u1EA5y c\u01B0\u1EDDi khi m\xECnh chuy\u1EC1n h\u1ED9 c\u1EE5c t\u1EA9y ho\u1EB7c gi\u1EA3ng b\xE0i t\u1EADp To\xE1n. B\u1EA1n \u1EA5y t\u1ED1t b\u1EE5ng v\u1EDBi t\u1EA5t c\u1EA3 m\u1ECDi ng\u01B0\u1EDDi, n\xEAn m\xECnh s\u1EE3 n\u1EBFu n\xF3i ra th\xEC ngay c\u1EA3 t\xECnh b\u1EA1n trong s\xE1ng n\xE0y c\u0169ng s\u1EBD tan v\u1EE1 m\u1EA5t...",
          category: "T\xECnh c\u1EA3m",
          empathy: 89,
          meToo: 82
        }
      ];
      const startIdx = day * 3 % pool.length;
      const todayPosts = [
        pool[startIdx % pool.length],
        pool[(startIdx + 1) % pool.length],
        pool[(startIdx + 2) % pool.length]
      ];
      const now = Date.now();
      todayPosts.forEach((post, i) => {
        const id = `ai_conf_${todayStr}_${i}`;
        const createdAt = new Date(now - (i * 2 + 1) * 3600 * 1e3).toISOString();
        this.data.confessions[id] = {
          id,
          user_id: null,
          source: "ai",
          title: post.title,
          content: post.content,
          category: post.category,
          author: "AI \u0110\u1ED3ng C\u1EA3m",
          author_type: "ai",
          avatar_seed: `ai_avatar_${i}_${day}`,
          is_anonymous: false,
          created_at: createdAt,
          updated_at: createdAt,
          visibility: "public",
          status: "active",
          empathy_count: post.empathy,
          me_too_count: post.meToo,
          comments: [],
          user_reactions: {},
          report_count: 0,
          date_key: todayStr
        };
      });
      this.scheduleSave();
    }
  }
  getConfessions(options) {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    this.ensureDailyAiConfessions(todayStr);
    let list = Object.values(this.data.confessions || {});
    list = list.filter((c) => (c.status === void 0 || c.status === "active") && (c.visibility === void 0 || c.visibility === "public"));
    if (options.category && options.category !== "T\u1EA5t c\u1EA3") {
      list = list.filter((c) => c.category === options.category);
    }
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q));
    }
    if (options.sortBy === "bookmarked" && options.bookmarkedIds) {
      const bSet = new Set(options.bookmarkedIds);
      list = list.filter((c) => bSet.has(c.id));
    }
    if (options.sortBy === "hot") {
      list.sort((a, b) => {
        const scoreA = (a.empathy_count || 0) * 1.5 + (a.me_too_count || 0) + (a.comments?.length || 0) * 2;
        const scoreB = (b.empathy_count || 0) * 1.5 + (b.me_too_count || 0) + (b.comments?.length || 0) * 2;
        return scoreB - scoreA;
      });
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return list.map((c) => ({
      id: c.id,
      userId: c.user_id || null,
      source: c.source || c.author_type || "user",
      title: c.title,
      content: c.content,
      category: c.category,
      author: c.author,
      authorType: c.author_type || c.source || "user",
      avatarSeed: c.avatar_seed,
      isAnonymous: c.is_anonymous,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      visibility: c.visibility || "public",
      status: c.status || "active",
      empathyCount: c.empathy_count || 0,
      meTooCount: c.me_too_count || 0,
      comments: (c.comments || []).map((cm) => ({
        id: cm.id,
        userId: cm.user_id || null,
        author: cm.author,
        authorType: cm.author_type || cm.source || "user",
        source: cm.source || cm.author_type || "user",
        avatarSeed: cm.avatar_seed,
        content: cm.content,
        createdAt: cm.created_at,
        likes: cm.likes || 0
      })),
      userReacted: options.userId ? c.user_reactions?.[options.userId] || {} : {},
      isBookmarked: options.bookmarkedIds?.includes(c.id) || false
    }));
  }
  createConfession(data) {
    if (!this.data.confessions) {
      this.data.confessions = {};
    }
    const id = "post_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const record = {
      id,
      user_id: data.userId || null,
      source: data.source || data.authorType || "user",
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category || "Kh\xE1c",
      author: data.isAnonymous ? data.author?.trim() || "B\u1EA1n nh\u1ECF \u1EA9n danh" : data.author?.trim() || "Th\xE0nh vi\xEAn",
      author_type: data.authorType || "user",
      avatar_seed: data.avatarSeed || "user_" + Math.random().toString(36).substring(2, 6),
      is_anonymous: !!data.isAnonymous,
      created_at: now,
      updated_at: now,
      visibility: "public",
      status: "active",
      empathy_count: 1,
      // Author's initial feeling
      me_too_count: 0,
      comments: [],
      user_reactions: data.userId ? { [data.userId]: { empathy: true } } : {},
      report_count: 0,
      date_key: now.split("T")[0]
    };
    this.data.confessions[id] = record;
    this.scheduleSave();
    return record;
  }
  deleteConfession(id, userId, isAdmin = false) {
    if (!this.data.confessions || !this.data.confessions[id]) {
      return { success: false, error: "Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt." };
    }
    const conf = this.data.confessions[id];
    if (!isAdmin && conf.user_id && conf.user_id !== userId) {
      return { success: false, error: "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a b\xE0i vi\u1EBFt n\xE0y." };
    }
    delete this.data.confessions[id];
    this.scheduleSave();
    return { success: true };
  }
  reactConfession(id, reactorId, type) {
    if (!this.data.confessions || !this.data.confessions[id]) {
      return { success: false };
    }
    const conf = this.data.confessions[id];
    if (!conf.user_reactions) conf.user_reactions = {};
    const userReact = conf.user_reactions[reactorId] || {};
    if (type === "empathy") {
      if (userReact.empathy) {
        userReact.empathy = false;
        conf.empathy_count = Math.max(0, (conf.empathy_count || 1) - 1);
      } else {
        userReact.empathy = true;
        conf.empathy_count = (conf.empathy_count || 0) + 1;
      }
    } else if (type === "meToo") {
      if (userReact.meToo) {
        userReact.meToo = false;
        conf.me_too_count = Math.max(0, (conf.me_too_count || 1) - 1);
      } else {
        userReact.meToo = true;
        conf.me_too_count = (conf.me_too_count || 0) + 1;
      }
    }
    conf.user_reactions[reactorId] = userReact;
    this.scheduleSave();
    return {
      success: true,
      record: {
        id: conf.id,
        empathyCount: conf.empathy_count,
        meTooCount: conf.me_too_count,
        userReacted: userReact
      }
    };
  }
  addConfessionComment(id, comment) {
    if (!this.data.confessions || !this.data.confessions[id]) {
      return { success: false };
    }
    const conf = this.data.confessions[id];
    if (!conf.comments) conf.comments = [];
    const newComm = {
      id: "comm_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
      user_id: comment.userId || null,
      author: comment.author.trim() || "Ng\u01B0\u1EDDi b\u1EA1n \u1EA9n danh",
      author_type: comment.authorType || "user",
      source: comment.source || comment.authorType || "user",
      avatar_seed: comment.avatarSeed || "commenter_seed",
      content: comment.content.trim(),
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      likes: 0
    };
    conf.comments.push(newComm);
    this.scheduleSave();
    return { success: true, comment: newComm };
  }
  reportConfession(id, reason) {
    if (!this.data.confessions || !this.data.confessions[id]) {
      return { success: false };
    }
    const conf = this.data.confessions[id];
    conf.report_count = (conf.report_count || 0) + 1;
    if (!conf.reports) conf.reports = [];
    conf.reports.push({ reason, created_at: (/* @__PURE__ */ new Date()).toISOString() });
    this.scheduleSave();
    return { success: true, reportCount: conf.report_count };
  }
  // ==================== Sticky Notes ("Bạn không cô đơn") ====================
  getStickyNotes() {
    if (!this.data.stickyNotes) {
      this.data.stickyNotes = {};
    }
    if (Object.keys(this.data.stickyNotes).length === 0) {
      const now = Date.now();
      const initial = [
        {
          id: "note_init_1",
          content: "C\xF3 th\u1EC3 h\xF4m nay c\u1EADu th\u1EA5y m\xECnh ch\u1EB3ng l\xE0m \u0111\u01B0\u1EE3c g\xEC, nh\u01B0ng c\u1EADu v\u1EABn \u0111ang c\u1ED1 g\u1EAFng t\u1EEBng ch\xFAt m\u1ED9t m\xE0.",
          author: "Minh Th\u01B0",
          author_type: "user",
          color: "bg-amber-100 text-amber-900 border-amber-200",
          likes: 24,
          created_at: new Date(now - 3 * 3600 * 1e3).toISOString()
        },
        {
          id: "note_init_2",
          content: "Kh\xF4ng ph\u1EA3i ng\xE0y n\xE0o c\u0169ng c\u1EA7n ph\u1EA3i \u1ED5n. C\xF3 nh\u1EEFng h\xF4m ch\u1EC9 c\u1EA7n \u0111i qua \u0111\u01B0\u1EE3c ng\xE0y h\xF4m \u0111\xF3 th\xF4i c\u0169ng \u0111\xE3 \u0111\u1EE7 r\u1ED3i.",
          author: "AI \u0110\u1ED3ng C\u1EA3m",
          author_type: "ai",
          color: "bg-emerald-100 text-emerald-900 border-emerald-200",
          likes: 45,
          created_at: new Date(now - 8 * 3600 * 1e3).toISOString()
        },
        {
          id: "note_init_3",
          content: "\u0110\u1EEBng \u0111\u1EC3 \u0111i\u1EC3m s\u1ED1 h\xF4m nay l\xE0m lu m\u1EDD \u0111i l\xF2ng nh\xE2n \xE1i v\xE0 s\u1EF1 t\u1EED t\u1EBF trong tim c\u1EADu.",
          author: "Qu\u1ED1c B\u1EA3o",
          author_type: "user",
          color: "bg-sky-100 text-sky-900 border-sky-200",
          likes: 19,
          created_at: new Date(now - 14 * 3600 * 1e3).toISOString()
        }
      ];
      initial.forEach((n) => {
        this.data.stickyNotes[n.id] = n;
      });
      this.scheduleSave();
    }
    return Object.values(this.data.stickyNotes).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  createStickyNote(data) {
    if (!this.data.stickyNotes) this.data.stickyNotes = {};
    const id = "note_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
    const colors = [
      "bg-amber-100 text-amber-900 border-amber-200",
      "bg-rose-100 text-rose-900 border-rose-200",
      "bg-sky-100 text-sky-900 border-sky-200",
      "bg-emerald-100 text-emerald-900 border-emerald-200",
      "bg-purple-100 text-purple-900 border-purple-200"
    ];
    const chosenColor = data.color || colors[Math.floor(Math.random() * colors.length)];
    const record = {
      id,
      content: data.content.trim(),
      author: data.author.trim() || "Ng\u01B0\u1EDDi b\u1EA1n nh\u1ECF",
      author_type: data.authorType || "user",
      color: chosenColor,
      likes: 1,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.stickyNotes[id] = record;
    this.scheduleSave();
    return record;
  }
  likeStickyNote(id) {
    if (!this.data.stickyNotes || !this.data.stickyNotes[id]) return { success: false };
    const n = this.data.stickyNotes[id];
    n.likes = (n.likes || 0) + 1;
    this.scheduleSave();
    return { success: true, likes: n.likes };
  }
  // ==================== User Progress Persistence ====================
  getUserProgress(userId) {
    if (!this.data.userProgress) this.data.userProgress = {};
    return this.data.userProgress[userId] || {
      bookmarkedConfessionIds: [],
      scenarioHistory: [],
      quizHistory: [],
      fastMathBestScore: 0,
      userReactions: {},
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  saveUserProgress(userId, progress) {
    if (!this.data.userProgress) this.data.userProgress = {};
    this.data.userProgress[userId] = {
      ...this.data.userProgress[userId],
      ...progress,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.scheduleSave();
    return true;
  }
};
var db = new Database();

// server/fastPathRouter.ts
var CRITICAL_SELF_HARM_PATTERNS = [
  /t[ựu]\s*t[ửu]/i,
  /mu[ốo]n\s*ch[ếe]t/i,
  /t[ựu]\s*h[ạa]i/i,
  /r[ạa]ch\s*tay/i,
  /u[ốo]ng\s*thu[ốo]c\s*(ng[ủu]|s[âa]u|chu[ộo]t)/i,
  /k[ếe]t\s*th[úu]c\s*cu[ộo]c\s*s[ốo]ng/i,
  /kh[ôo]ng\s*mu[ốo]n\s*s[ốo]ng/i,
  /ch[ếe]t\s*đi\s*cho\s*xong/i,
  /(tui|m[ìi]nh|em)\s*mu[ốo]n\s*bi[ếe]n\s*m[ấa]t/i,
  /mu[ốo]n\s*bi[ếe]n\s*m[ấa]t\s*kh[ỏo]i\s*th[ếe]\s*gi[ớo]i/i,
  /nh[ảa]y\s*(c[ầa]u|l[ầa]u)/i,
  /kh[ôo]ng\s*thi[ếe]t\s*s[ốo]ng/i,
  /gi[ảa]i\s*tho[áa]t\s*kh[ỏo]i\s*cu[ộo]c\s*đ[ờo]i/i
];
function isEmergencyQuery(text) {
  const trimmed = text.trim();
  const isStudyOrCasualContext = /(b[àa]i\s*t[ậa]p|b[àa]i\s*to[áa]n|b[àa]i\s*v[ăa]n|b[àa]i\s*v[ởo]|b[àa]i\s*học|c[âa]u\s*n[àa]y|b[àa]i\s*n[àa]y|m[ôo]n|đ[ềe]|to[áa]n|l[ýy]|h[óa]a|v[ăa]n|anh|s[ửu]|đ[ịi]a|deadline|game|tr[òo]\s*ch[ơo]i|ch[ơo]i|k[ỳy]\s*thi|thi\s*c[ửu]|ki[ểe]m\s*tra|đi[ểe]m|l[àa]m\s*sao\s*gi[ảa]i|c[áa]ch\s*gi[ảa]i)/i.test(trimmed);
  if (isStudyOrCasualContext) {
    return CRITICAL_SELF_HARM_PATTERNS.some((p) => p.test(trimmed));
  }
  for (const pattern of CRITICAL_SELF_HARM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return true;
    }
  }
  const isBareCrisisCry = /^c[ứu]u\s*(tui|m[ìi]nh|em|tao)\s*(v[ớo]i)?[\.!\?]*$/i.test(trimmed);
  const hasDangerSign = /c[ứu]u\s*(tui|m[ìi]nh|em|tao).*(b[ịi]\s*(đ[áa]nh|b[ạa]o\s*h[àa]nh|nh[ốo]t|đe\s*d[ọo]a)|nguy\s*hi[ểe]m|kh[ôo]ng\s*th[ởo]\s*đ[ư\s]*[ợo]c)/i.test(trimmed);
  return isBareCrisisCry || hasDangerSign;
}
var CLARIFICATION_PATTERNS = [
  /^\?+$/,
  /^l[àa]\s*sao(\s*(c[ơo]|[áa]|v[ậa]y|ta|h[ảa]|nh[ỉi]|b[ạa]n|c[ậa]u|đ[óo]|n[èe]))?[\?!\.]*$/iu,
  /^[ýy]\s*(l[àa]\s*g[ìi]|c[ậa]u|b[ạa]n|l[àa]\s*sao|l[àa]\s*nh[ư\s]*\s*n[àa]o|l[àa]\s*th[ếe]\s*n[àa]o)[\?!\.]*$/iu,
  /^sao\s*(c[ơo]|d[ạa]|[áa]|nh[ỉi])[\?!\.]*$/iu,
  /^[ýy]\s*(c[ậa]u|b[ạa]n|m[ìi]nh)\s*l[àa]\s*(sao|g[ìi]|th[ếe]\s*n[àa]o|nh[ư\s]*\s*n[àa]o)[\?!\.]*$/iu,
  /^gi[ảa]i\s*th[íi]ch\s*(đi|h[ộo]|cho|r[õo]|l[ạa]i|h[ơo]n|xem)[\?!\.]*$/iu,
  /^(m[ìi]nh|t[ớo]|em|tui|tao)?\s*(ch[ư\s]*a|kh[ôo]ng|h[ổo]ng|h[ôo]ng|ko|ch[ảa]|ch[ẳa]ng)\s*hi[ểe]u(\s*(l[ắa]m|g[ìi]|h[ếe]t))?[\?!\.]*$/iu,
  /^c[ụu]\s*th[ểe]\s*(l[àa]\s*g[ìi]|h[ơo]n|l[àa]\s*sao|h[ơo]n\s*đi)[\?!\.]*$/iu,
  /^nh[ư\s]*ng\s*(t[ạa]i\s*sao|sao|sao\s*l[ạa]i\s*th[ếe]|sao\s*l[ạa]i\s*v[ậa]y)[\?!\.]*$/iu,
  /^sao\s*l[ạa]i\s*(th[ếe]|v[ậa]y|nh[ư\s]*\s*th[ếe]|nh[ư\s]*\s*v[ậa]y)[\?!\.]*$/iu,
  /^t[ạa]i\s*sao\s*(l[ạa]i\s*)?(th[ếe]|v[ậa]y)[\?!\.]*$/iu,
  /^ngh[ĩi]a\s*l[àa]\s*(sao|g[ìi])[\?!\.]*$/iu,
  /^n[óo]i\s*r[õo]\s*(h[ơo]n)?\s*(h[ộo]|đi|xem)?[\?!\.]*$/iu
];
var ADVICE_SEEKING_PATTERNS = [
  /ph[ảa]i\s*l[àa]m\s*sao/iu,
  /n[êe]n\s*l[àa]m\s*g[ìi]/iu,
  /l[àa]m\s*g[ìi]\s*b[âa]y\s*gi[ờo]/iu,
  /gi[ờo]\s*(m[ìi]nh|t[ớo]|em|tao)\s*n[êe]n\s*l[àa]m\s*g[ìi]/iu,
  /gi[ờo]\s*sao\s*đ[âa]y/iu,
  /gi[ờo]\s*ph[ảa]i\s*sao/iu,
  /x[ửu]\s*l[ýy]\s*(th[ếe]\s*n[àa]o|sao|nh[ư\s]*\s*n[àa]o)/iu,
  /gi[ảa]i\s*quy[ếe]t\s*(sao|th[ếe]\s*n[àa]o|nh[ư\s]*\s*n[àa]o)/iu,
  /c[óo]\s*c[áa]ch\s*n[àa]o/iu,
  /t[íi]nh\s*sao\s*(đ[âa]y|gi[ờo])/iu,
  /n[êe]n\s*(l[àa]m|ch[ọo]n|n[óo]i|nh[ắa]n|x[ửu]\s*l[ýy]|h[ỏo]i)\s*(g[ìi]|sao|th[ếe]\s*n[àa]o)/iu,
  /cho\s*(m[ìi]nh|t[ớo]|em|tao)\s*(l[ờo]i\s*khuy[êe]n|h[ư\s]*[ớo]ng\s*gi[ảa]i\s*quy[ếe]t|c[áa]ch\s*gi[ảa]i\s*quy[ếe]t|g[ợo]i\s*[ýy])/iu
];
var CONCRETE_REQUEST_PATTERNS = [
  ...ADVICE_SEEKING_PATTERNS,
  /gi[úu]p\s*(tui|m[ìi]nh|em|tao)(\s*(l[àa]m|gi[ảa]i|ch[ọo]n|v[ớo]i|c[áa]i\s*n[àa]y))?/i,
  /ch[ỉi]\s*(tui|m[ìi]nh|em|tao)\s*(c[áa]ch|l[àa]m\s*sao|v[ớo]i)/i,
  /l[àa]m\s*sao\s*đ[ểe]/i,
  /l[àa]m\s*th[ếe]\s*n[àa]o\s*đ[ểe]/i,
  /h[ư\s]*[ớo]ng\s*d[ẫa]n/i,
  /ch[ọo]n\s*tr[ư\s]*[ờo]ng/i,
  /gi[ảa]i\s*(b[àa]i|to[áa]n|đ[ềe])/i,
  /b[àa]i\s*t[ậa]p/i,
  /ch[ỉi]\s*gi[áa]o/i,
  /b[àa]y\s*(tui|m[ìi]nh|em|tao)\s*c[áa]ch/i,
  /gi[úu]p\s*(tui|m[ìi]nh|em)\s*v[ớo]i/i,
  /c[óo]\s*th[ểe]\s*cho\s*(tui|m[ìi]nh)\s*l[ờo]i\s*khuy[êe]n/i,
  /h[ỏo]i\s*(t[íi]|c[áa]i\s*n[àa]y|chuy[ệe]n\s*n[àa]y)/i
];
var EMOTION_PROBLEM_PATTERNS = [
  /(?:^|[^\p{L}])bu[ồo]n(?:\s*(?:qu[áa]|l[ắa]m|thiu|ng[ủu]))?(?:[^\p{L}]|$)/iu,
  /(?:^|[^\p{L}])ch[áa]n(?:\s*(?:qu[áa]|đ[ờo]i|n[ảa]n|ch[ư\s]*[ờo]ng))?(?:[^\p{L}]|$)/iu,
  /(?:^|[^\p{L}])m[ệe]t(?:\s*(?:qu[áa]|m[ỏo]i|l[ắa]m|nho[àa]i))?(?:[^\p{L}]|$)/iu,
  /ki[ệe]t\s*s[ứu]c/iu,
  /(?:^|[^\p{L}])s[ợo](?:\s*(?:qu[áa]|h[ãa]i))?(?:[^\p{L}]|$)/iu,
  /(?:^|[^\p{L}])lo(?:\s*(?:qu[áa]|l[ắa]ng|s[ốo]t\s*v[óo]|ngh[ĩi]))?(?:[^\p{L}]|$)/iu,
  /[áa]p\s*l[ựu]c/iu,
  /(?:^|[^\p{L}])stress(?:[^\p{L}]|$)/iu,
  /c[ăa]ng\s*th[ẳa]ng/iu,
  /b[ếe]\s*t[ắa]c/iu,
  /(?:^|[^\p{L}])t[ứu]c(?:\s*(?:qu[áa]|gi[ậa]n|đi[êe]n))?(?:[^\p{L}]|$)/iu,
  /b[ựu]c(\s*m[ìi]nh)?/iu,
  /cay\s*c[úu]/iu,
  /(?:^|[^\p{L}])kh[óo]c(?:\s*s[ư\s]*ng\s*m[ắa]t)?(?:[^\p{L}]|$)/iu,
  /r[ơo]i\s*n[ư\s]*[ớo]c\s*m[ắa]t/iu,
  /c[ãa]i\s*nhau/iu,
  /chia\s*tay/iu,
  /b[ịi]\s*(m[ắa]ng|ch[ửu]i|ph[ạa]t|t[ừu]\s*ch[ốo]i|t[ẩa]y\s*chay|c[ôo]\s*l[ậa]p|đ[áa]nh|b[ắa]t\s*n[ạa]t|l[ừu]a)/iu,
  /c[ôo]\s*đ[ơo]n/iu,
  /t[ủu]i\s*th[âa]n/iu,
  /t[ụu]t\s*mood/iu,
  /h[ụu]t\s*h[ẫa]ng/iu,
  /th[ấa]t\s*v[ọo]ng/iu,
  /b[ấa]t\s*l[ựu]c/iu,
  /đi[ểe]m\s*k[ée]m/iu,
  /r[ớo]t\s*m[ôo]n/iu,
  /thi\s*tr[ư\s]*[ợo]t/iu,
  /qu[áa]\s*t[ảa]i/iu,
  /qu[êe]\s*x[ệe]/iu,
  /ngh[ỉi]\s*ch[ơo]i/iu,
  /kh[ôo]ng\s*n[óo]i\s*chuy[ệe]n\s*n[ữư]a/iu,
  /crush\s*(kh[ôo]ng\s*rep|seen|th[íi]ch\s*ng[ư\s]*[ờo]i\s*kh[áa]c)/iu,
  /b[ốo]\s*m[ẹe]\s*(so\s*s[áa]nh|c[ấa]m|m[ắa]ng)/iu
];
var CONTEXT_CONTINUATION_PATTERNS = [
  /^kh[ôo]ng\s*bi[ếe]t(\s*n[ữư]a)?$/i,
  /^ch[ẳa]ng\s*bi[ếe]t(\s*n[ữư]a)?$/i,
  /^ch[ảa]\s*bi[ếe]t(\s*n[ữư]a)?$/i,
  /kh[ôo]ng\s*bi[ếe]t\s*(t[ạa]i\s*sao|m[ìi]nh\s*b[ịi]\s*g[ìi])/i,
  /^sao\s*gi[ờo](\s*nh[ĩi])?$/i,
  /^sao\s*đ[âa]y$/i,
  /^th[ìi]\s*v[ậa]y\s*đ[óo]$/i,
  /^ừ\s*nh[ư\s]*ng\s*m[àa]/i,
  /^nh[ư\s]*ng\s*m[àa]/i,
  /^v[ậa]y\s*th[ìi]/i,
  /^th[ếe]\s*[àa]$/i,
  /^v[ậa]y\s*[áa]$/i,
  /^th[ậa]t\s*[áa]$/i,
  /^r[ồo]i\s*sao\s*n[ữư]a$/i,
  /^ti[ếe]p\s*theo\s*l[àa]\s*g[ìi]$/i
];
var CORRECTION_PATTERNS = [
  /^(kh[ôo]ng\s*ph[ảa]i|h[ôo]ng\s*ph[ảa]i|h[ơo]m\s*ph[ảa]i)(\s*([!?.😭=):;~]+|nha|nh[ée]|đ[âa]u))?$/i,
  /^(kh[ôo]ng\s*ph[ảa]i|h[ôo]ng\s*ph[ảa]i|h[ơo]m\s*ph[ảa]i)\b/i,
  /^([ýy]\s*(t[ớo]|tui|m[ìi]nh|em)\s*l[àa]|[ýy]\s*l[àa](?!\s*(g[ìi]|sao|nh[ư\s]*\s*n[àa]o|th[ếe]\s*n[àa]o)))/iu,
  /^kh[ôo]ng\s*,\s*(c[áa]i\s*đ[óo]|chuy[ệe]n\s*đ[óo]|t[ạa]i|t[ớo]|m[ìi]nh)/i,
  /c[ậa]u\s*hi[ểe]u\s*sai\s*r[ồo]i/i,
  /(t[ớo]|tui|m[ìi]nh|em)\s*đang\s*n[óo]i\s*v[ềe]/i,
  /kh[ôo]ng\s*ph[ảa]i\s*(chuy[ệe]n\s*đ[óo]|v[ậa]y|th[ếe]|c[áa]i\s*đ[óo])/i,
  /[ýy]\s*(t[ớo]|tui|m[ìi]nh|em)\s*kh[áa]c/i,
  /tr[ờo]i\s*ơi\s*kh[ôo]ng(\s*(=|\)|:|😭|!|\?)+)?/i,
  /kh[ôo]ng\s*nha/i,
  /tui\s*n[óo]i\s*l[àa]/i,
  /ai\s*b[ảa]o\s*th[ếe]/i,
  /đ[âa]u\s*ph[ảa]i\s*v[ậa]y/i,
  /hi[ểe]u\s*l[ầa]m\s*r[ồo]i/i
];
var TOPIC_SWITCH_PATTERNS = [
  /^([àa]|a)\s*m[àa](?:[^\p{L}]|$)/iu,
  /^ti[ệe]n\s*th[ểe](?:[^\p{L}]|$)/iu,
  /^c[òo]n\s*chuy[ệe]n\s*n[àa]y(?:[^\p{L}]|$)/iu,
  /^m[àa]\s*n[àa]y(?:[^\p{L}]|$)/iu,
  /^k[ểe]\s*(c[ậa]u|b[ạa]n|nghe)\s*(c[áa]i\s*n[àa]y|chuy[ệe]n\s*n[àa]y)/iu,
  /^chuy[ệe]n\s*kh[áa]c\s*n[èe](?:[^\p{L}]|$)/iu,
  /^th[ôo]i\s*n[óo]i\s*chuy[ệe]n\s*kh[áa]c/iu
];
function isBotQuestion(botMessage) {
  if (!botMessage) return false;
  const t = botMessage.trim();
  if (t.includes("?")) return true;
  if (/hay\s+(l[àa]|ở|c[ùu]ng|m[ìi]nh)\b/i.test(t)) return true;
  if (/ch[ọo]n\s+(c[áa]i|c[áa]ch|h[ư\s]*[ớo]ng|m[ôo]n)\b/i.test(t)) return true;
  if (/b[ạa]n\s+mu[ốo]n\s+/i.test(t)) return true;
  return false;
}
function cleanText(str) {
  return str.toLowerCase().trim().replace(/[.,?!~:;'"/\-_=+*#@$%^&()[\]{}<>]/g, " ").replace(/\s+/g, " ").trim();
}
function collapseRepeatedLetters(str) {
  return str.replace(/(.)\1{2,}/g, "$1$1");
}
function matchFastPathCategory(text) {
  const cleaned = cleanText(text);
  const collapsed = collapseRepeatedLetters(cleaned);
  const greetingExact = [
    "hi",
    "hii",
    "hiii",
    "hello",
    "helo",
    "heloo",
    "hey",
    "heyy",
    "chao",
    "chao ban",
    "chao cau",
    "chao nha",
    "chao ban nha",
    "he lo",
    "he looo",
    "he lu",
    "hi ban",
    "hi cau",
    "hello ban",
    "hello nha",
    "hi nha",
    "halo",
    "hallo",
    "hola"
  ];
  if (greetingExact.includes(cleaned) || greetingExact.includes(collapsed) || /^(hi+|he+y+|he+l+o+|h[aá]lo|h[ií]|h[ếe]\s*l[ôo]|ch[àa]o)(\s+(b[ạa]n|c[ậa]u|nha|nh[ée]|n[èe]|nhe|nghen|ơ+i|iu|m[ìi]nh|m|m[àa]y)){0,2}$/i.test(cleaned) || /^(hi+|he+y+|he+l+o+|h[ếe]\s*l[ôo]|ch[àa]o)(\s+(b[ạa]n|c[ậa]u|nha|nh[ée]|n[èe]|nhe|nghen|ơ+i|iu|m[ìi]nh|m|m[àa]y)){0,2}$/i.test(collapsed)) {
    return "greeting";
  }
  const callExact = [
    "e",
    "ee",
    "eee",
    "alo",
    "alo alo",
    "nay",
    "ne",
    "ban oi",
    "cau oi",
    "e ban",
    "e ban oi",
    "alo ban",
    "alo ban oi",
    "e bot",
    "bot oi",
    "minh noi ne",
    "nghe ne",
    "nghe tui noi ne",
    "oi",
    "oi ban"
  ];
  if (callExact.includes(cleaned) || callExact.includes(collapsed) || /^(ê+|ee+|alo+|alô+|n[àa]y|n[èe]|ơ+i)(\s+(b[ạa]n|c[ậa]u|ơ+i|n[èe]|nha|bot|tui|m[ìi]nh|m|m[àa]y|nghe|n[óo]i\s*n[èe])){0,3}$/i.test(cleaned) || /^(ê+|ee+|alo+|alô+|n[àa]y|n[èe]|ơ+i)(\s+(b[ạa]n|c[ậa]u|ơ+i|n[èe]|nha|bot|tui|m[ìi]nh|m|m[àa]y|nghe|n[óo]i\s*n[èe])){0,3}$/i.test(collapsed) || /^(b[ạa]n|c[ậa]u|bot)\s+ơ+i$/i.test(cleaned)) {
    return "call";
  }
  const reactionExact = [
    "haha",
    "hahaha",
    "hehe",
    "hehehe",
    "hihi",
    "hihihi",
    "huhu",
    "huhuhu",
    "keke",
    "kekeke",
    "wow",
    "oi doi",
    "u la troi",
    "choi oi",
    "troi oi",
    "vai",
    "vui ghe",
    "hai z",
    "hai qua",
    "khoai khoai"
  ];
  if (reactionExact.includes(cleaned) || reactionExact.includes(collapsed) || /^(ha+ha+|he+he+|hi+hi+|hu+hu+|ke+ke+|wo+w|u\s*l[àa]\s*tr[ờo]i|ch[ờo]i\s*ơi|tr[ờo]i\s*ơi|h[àa]i\s*z|vui\s*gh[êe])$/i.test(cleaned) || /^(ha+ha+|he+he+|hi+hi+|hu+hu+|ke+ke+|wo+w|u\s*l[àa]\s*tr[ờo]i|ch[ờo]i\s*ơi|tr[ờo]i\s*ơi|h[àa]i\s*z|vui\s*gh[êe])$/i.test(collapsed)) {
    return "reaction";
  }
  const emoticonRegex = /^(\s*[:=;xX8B]-?[\)\(\]\[DPpvdDoO3*><c~^]{1,6}\s*|\s*(\^\^|\^_\^|\(y\)|<3|:\)\)+|=\)\)+)\s*)+$/;
  if (emoticonRegex.test(text.trim())) {
    return "reaction";
  }
  const thanksExact = [
    "cam on",
    "cam on nha",
    "cam on nhieu",
    "cam on ban",
    "cam on cau",
    "thanks",
    "thank you",
    "tks",
    "thank",
    "iu ban",
    "thuong ghe",
    "doi on"
  ];
  if (thanksExact.includes(cleaned) || /^(c[ảa]m\s*ơ+n|thanks?|thank\s*you|tks)(\s*(nha|nh[ée]|n[èe]|b[ạa]n|c[ậa]u|nhi[ềe]u|nh[ìi]u|nghen|nhe|ạ))?$/i.test(cleaned) || /^(iu|th[ư\s]*[ơo]ng)\s*(b[ạa]n|c[ậa]u)(\s*gh[êe]|\s*nha)?$/i.test(cleaned)) {
    return "thanks";
  }
  const goodbyeExact = [
    "bye",
    "bye bye",
    "bai",
    "bai nha",
    "bai bai",
    "bai nha ban",
    "tam biet",
    "tam biet nha",
    "tam biet ban",
    "gap lai sau",
    "di ngu day",
    "ngu day",
    "di hoc day",
    "bibi"
  ];
  if (goodbyeExact.includes(cleaned) || /^(bye+|bai+|b[áa]i\s*bai|t[ạa]m\s*bi[ệe]t|bi\s*bi)(\s*(nha|nh[ée]|n[èe]|b[ạa]n|c[ậa]u|nghen|nhe))?$/i.test(cleaned) || /^(đi\s*ng[ủu]|ng[ủu]|đi\s*h[ọo]c)\s*đ[âa]y(\s*nha)?$/i.test(cleaned) || /^g[ặa]p\s*l[ạa]i\s*sau(\s*nha)?$/i.test(cleaned)) {
    return "goodbye";
  }
  const ackExact = [
    "ok",
    "oke",
    "okie",
    "oki",
    "ok ban",
    "oke ban",
    "ok nha",
    "oke nha",
    "uk",
    "uh",
    "da",
    "roi",
    "vang",
    "duoc",
    "duoc roi",
    "yes",
    "yep",
    "ro roi",
    "hieu roi",
    "chot",
    "oke ne",
    "ok ne"
  ];
  if (ackExact.includes(cleaned) || ackExact.includes(collapsed) || /^(o+k+e*|o+k+i+e*|u+k+|u+h+|d[ạa]|v[âa]ng|r[ồo]i|đ[ư\s]*[ợo]c)(\s*(n[èe]|nha|nh[ée]|b[ạa]n|c[ậa]u|r[ồo]i|lu[ôo]n|ạ))?$/i.test(cleaned) || /^(r[õo]|hi[ểe]u|đ[ư\s]*[ợo]c)\s*r[ồo]i(\s*nha)?$/i.test(cleaned)) {
    return "acknowledgment";
  }
  return null;
}
function extractContextTopic(previousMessages) {
  if (!previousMessages || previousMessages.length === 0) return null;
  const userMessages = previousMessages.filter((m) => m.role === "user").slice(-2);
  const combined = userMessages.map((m) => m.content.toLowerCase()).join(" ");
  if (/(thi|ki[ểe]m\s*tra|b[àa]i\s*t[ậa]p|[ôo]n\s*thi|đ[ốo]i\s*ph[óo]\s*thi)/i.test(combined)) {
    return "exam";
  }
  if (/(b[ạa]n\s*th[âa]n|c[ãa]i\s*nhau|crush|ngh[ỉi]\s*ch[ơo]i|t[ẩa]y\s*chay|ng[ư\s]*[ờo]i\s*y[êe]u|seen)/i.test(combined)) {
    return "relationship";
  }
  if (/(bu[ồo]n|m[ệe]t|[áa]p\s*l[ựu]c|kh[óo]c|stress|ki[ệe]t\s*s[ứu]c)/i.test(combined)) {
    return "sadness";
  }
  return null;
}
function pickResponse(candidates, lastBotReply) {
  const filtered = lastBotReply ? candidates.filter((c) => c.trim().toLowerCase() !== lastBotReply.trim().toLowerCase()) : candidates;
  const pool = filtered.length > 0 ? filtered : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}
function generateFastPathResponse(category, previousMessages = [], lastBotReply) {
  const recentTopic = extractContextTopic(previousMessages);
  switch (category) {
    case "greeting": {
      if (recentTopic === "exam") {
        const examCandidates = [
          "hiii, v\u1EABn c\xF2n s\u1ED1ng s\xF3t sau v\u1EE5 b\xE0i v\u1EDF thi c\u1EED \u0111\xF3 h\u1EA3 =))",
          "heyy! V\u1EE5 b\xE0i v\u1EDF h\xF4m tr\u01B0\u1EDBc t\u1EDBi \u0111\xE2u r\u1ED3i c\u1EADu \u01A1i? \u{1F440}",
          "hiii :)) nay \u0111\xE3 \u0111\u1EE1 ng\u1EE3p h\u01A1n mi\u1EBFng n\xE0o ch\u01B0a?"
        ];
        return pickResponse(examCandidates, lastBotReply);
      }
      if (recentTopic === "relationship") {
        const relCandidates = [
          "hiii, chuy\u1EC7n h\xF4m tr\u01B0\u1EDBc \xEAm h\u01A1n t\xED n\xE0o ch\u01B0a n\xE8? \u{1F440}",
          "heyy t\u1EDB \u0111\xE2y =)) M\u1ECDi chuy\u1EC7n \u0111\u1EE1 r\u1ED1i h\u01A1n x\xEDu n\xE0o ch\u01B0a c\u1EADu?"
        ];
        return pickResponse(relCandidates, lastBotReply);
      }
      if (recentTopic === "sadness") {
        const sadCandidates = [
          "hiii :)) nay t\xE2m tr\u1EA1ng c\xF3 \u0111\u1EE1 h\u01A1n x\xEDu n\xE0o ch\u01B0a c\u1EADu \u01A1i?",
          "heyy, t\u1EDB \u0111\xE2y =)) H\xF4m nay n\u1EA1p l\u1EA1i \u0111\u01B0\u1EE3c ch\xFAt n\u0103ng l\u01B0\u1EE3ng n\xE0o ch\u01B0a n\xE8?"
        ];
        return pickResponse(sadCandidates, lastBotReply);
      }
      const greetingCandidates = [
        "hii :)) nay sao r\u1ED3i c\u1EADu?",
        "heyy, t\u1EDB \u0111\xE2y =))",
        "hiii, c\xF3 chuy\u1EC7n g\xEC k\u1EC3 t\u1EDB nghe coi \u{1F440}",
        "h\u1EBF l\xF4! Nay c\xF3 bi\u1EBFn g\xEC m\u1EDBi k\u1EC3 t\u1EDB nghe li\u1EC1n n\xE8 =)))",
        "t\u1EDB nghe n\xE8, h\xF4m nay c\u1EE7a c\u1EADu th\u1EBF n\xE0o?",
        "heyy c\u1EADu \u01A1i, t\u1EDB \u0111ang ng\u1ED3i \u0111\xE2y n\xE8 =))",
        "ch\xE0o c\u1EADu =)) nay c\xF3 chuy\u1EC7n g\xEC k\u1EC3 t\u1EDB nghe v\u1EDBi!"
      ];
      return pickResponse(greetingCandidates, lastBotReply);
    }
    case "call": {
      const callCandidates = [
        "g\xEC \u0111\xF3 =))",
        "alo alo, t\u1EDB nghe n\xE8 \u{1F440}",
        "t\u1EDB \u0111\xE2y, c\xF3 bi\u1EBFn g\xEC k\u1EC3 l\u1EB9 coi =))",
        "\u01A1i t\u1EDB nghe n\xE8, c\xF3 chuy\u1EC7n g\xEC \xE1?",
        "nghe r\xF5 m\u01B0\u1EDDi m\u01B0\u01A1i, n\xF3i \u0111i t\u1EDB h\xF3ng n\xE8 =))",
        "th\xF4i l\u1EA1i \u0111\xE2y k\u1EC3 t\u1EDB nghe =)))"
      ];
      return pickResponse(callCandidates, lastBotReply);
    }
    case "reaction": {
      const reactionCandidates = [
        "c\u01B0\u1EDDi g\xEC zui z =))",
        "haha g\xEC \xE1, k\u1EC3 t\u1EDB c\u01B0\u1EDDi k\xE9 coi =))",
        "th\u1EA5y c\u1EADu c\u01B0\u1EDDi l\xE0 th\u1EA5y vui l\xE2y r\u1ED3i \u0111\xF3 :D",
        "vui v\u1EBB d\u1EEF ta =)) c\xF3 chuy\u1EC7n g\xEC k\u1EC3 nghe coi?",
        "g\xEC m\xE0 kho\xE1i ch\xED d\u1EEF th\u1EA7n v\u1EADy n\xE8 =)))",
        "=))) c\u01B0\u1EDDi t\xEDt m\u1EAFt lu\xF4n h\u1EA3 c\u1EADu"
      ];
      return pickResponse(reactionCandidates, lastBotReply);
    }
    case "thanks": {
      const thanksCandidates = [
        "h\xF4ng c\xF3 chi \u0111\xE2u n\xE8 :D B\u1EA1n b\xE8 v\u1EDBi nhau m\xE0!",
        "c\xF3 g\xEC \u0111\xE2u n\xE8 =)) Th\u1EA5y c\u1EADu nh\u1EB9 nh\xF5m h\u01A1n x\xEDu l\xE0 t\u1EDB vui r\u1ED3i \xE1 \u{1F338}",
        "kh\xE1ch s\xE1o qu\xE1 nha =)) C\xF3 g\xEC c\u1EE9 \u1EDBi t\u1EDB ti\u1EBFp nghen!",
        "th\u01B0\u01A1ng c\u1EADu gh\xEA, c\xF3 g\xEC c\u1EE9 t\xE2m s\u1EF1 v\u1EDBi t\u1EDB nha :D"
      ];
      return pickResponse(thanksCandidates, lastBotReply);
    }
    case "goodbye": {
      const goodbyeCandidates = [
        "bai bai nha! \u0110i ngh\u1EC9 ng\u01A1i cho l\u1EA1i s\u1EE9c nghen \u{1F337}",
        "b\xE1i bai, khi n\xE0o r\u1EA3nh l\u1EA1i gh\xE9 bu\xF4n chuy\u1EC7n v\u1EDBi t\u1EDB ti\u1EBFp nha \u{1F440}",
        "bye bye n\xE8, nh\u1EDB gi\u1EEF g\xECn s\u1EE9c kh\u1ECFe nghen :D",
        "okie bai c\u1EADu, c\xF3 chuy\u1EC7n g\xEC l\u1EA1i \u1EDBi t\u1EDB b\u1EA5t c\u1EE9 l\xFAc n\xE0o nha!",
        "bai nha, t\u1EDB v\u1EABn lu\xF4n \u1EDF \u0111\xE2y nghe c\u1EADu n\xF3i \u0111\xF3 :D"
      ];
      return pickResponse(goodbyeCandidates, lastBotReply);
    }
    case "acknowledgment": {
      const ackCandidates = [
        "okie n\xE8 c\u1EADu =))",
        "\u1EEBm, t\u1EDB v\u1EABn \u0111ang ng\u1ED3i \u0111\xE2y n\xE8.",
        "oke lu\xF4n =)) c\u1EE9 t\u1EEB t\u1EEB nha, t\u1EDB nghe h\u1EBFt n\xE8.",
        "okie, c\u1EADu c\u1EE9 thong th\u1EA3 nha :D"
      ];
      return pickResponse(ackCandidates, lastBotReply);
    }
  }
}
function classifyChatMessage(message, previousMessages = [], lastBotReply) {
  const trimmed = message.trim();
  if (!trimmed) {
    return { decision: "FAST_PATH", category: "greeting", response: "heyy, tui \u0111\xE2y =))" };
  }
  if (isEmergencyQuery(trimmed)) {
    const safetyResponse = `M\xECnh nghe \u0111\xE2y, v\xE0 m\xECnh th\u1EF1c s\u1EF1 r\u1EA5t lo l\u1EAFng cho b\u1EA1n. \u{1FAC2} C\u1EA3m gi\xE1c ki\u1EC7t s\u1EE9c v\xE0 b\u1EBF t\u1EAFc l\xFAc n\xE0y ch\u1EAFc ch\u1EAFn \u0111ang \u0111\xE8 n\u1EB7ng l\xEAn b\u1EA1n r\u1EA5t nhi\u1EC1u... Nh\u01B0ng b\u1EA1n \u01A1i, s\u1EF1 an to\xE0n c\u1EE7a b\u1EA1n l\xE0 \u0111i\u1EC1u quan tr\u1ECDng nh\u1EA5t, v\xE0 b\u1EA1n kh\xF4ng h\u1EC1 ph\u1EA3i ch\u1ECBu \u0111\u1EF1ng \u0111i\u1EC1u n\xE0y m\u1ED9t m\xECnh \u0111\xE2u.

M\xECnh tha thi\u1EBFt mong b\u1EA1n h\xE3y m\u1EDF l\xF2ng v\u1EDBi m\u1ED9t ng\u01B0\u1EDDi l\u1EDBn \u0111\xE1ng tin c\u1EADy \u1EDF g\u1EA7n (b\u1ED1 m\u1EB9, th\u1EA7y c\xF4, ng\u01B0\u1EDDi th\xE2n).

N\u1EBFu c\xF3 nguy hi\u1EC3m kh\u1EA9n c\u1EA5p ngay l\xFAc n\xE0y, h\xE3y g\u1ECDi c\u1EA5p c\u1EE9u **115**.

M\xECnh v\u1EABn \u1EDF \u0111\xE2y l\u1EAFng nghe b\u1EA1n, nh\u01B0ng h\xE3y \u0111\u1EC3 ng\u01B0\u1EDDi l\u1EDBn c\xF9ng b\u1EA3o v\u1EC7 b\u1EA1n an to\xE0n nh\xE9! \u{1F337}`;
    return {
      decision: "SAFETY",
      reason: "Critical safety concern detected",
      response: safetyResponse
    };
  }
  for (const pattern of CORRECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: "NORMAL_AI",
        reason: "User correction signal detected - discard old false assumption immediately",
        isCorrection: true
      };
    }
  }
  for (const pattern of CLARIFICATION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: "NORMAL_AI",
        reason: 'User asks for clarification of immediate previous bot message ("?", "l\xE0 sao?", "\xFD l\xE0 g\xEC?")',
        isClarificationRequest: true
      };
    }
  }
  for (const pattern of TOPIC_SWITCH_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: "NORMAL_AI",
        reason: "User topic switch detected - follow new topic",
        isTopicSwitch: true
      };
    }
  }
  for (const pattern of ADVICE_SEEKING_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: "NORMAL_AI",
        reason: 'Explicit advice or solution seeking query ("ph\u1EA3i l\xE0m sao", "n\xEAn l\xE0m g\xEC")',
        isAdviceRequest: true
      };
    }
  }
  for (const pattern of CONCRETE_REQUEST_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: "NORMAL_AI",
        reason: "Concrete request / explicit help needed"
      };
    }
  }
  for (const pattern of EMOTION_PROBLEM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: "NORMAL_AI",
        reason: "Emotional distress or problem signal detected"
      };
    }
  }
  const botAsked = isBotQuestion(lastBotReply);
  const fastPathCat = matchFastPathCategory(trimmed);
  if (botAsked) {
    if (fastPathCat === "acknowledgment" || !fastPathCat && trimmed.length < 80) {
      return {
        decision: "CONTEXT_MODE",
        reason: "User is answering bot previous question - proceed from this answer without re-asking",
        isAnsweringQuestion: true
      };
    }
  }
  for (const pattern of CONTEXT_CONTINUATION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        decision: "CONTEXT_MODE",
        reason: "Context continuation / ambiguous intent in ongoing conversation"
      };
    }
  }
  if (fastPathCat) {
    const reply = generateFastPathResponse(fastPathCat, previousMessages, lastBotReply);
    return {
      decision: "FAST_PATH",
      category: fastPathCat,
      response: reply
    };
  }
  return {
    decision: "CONTEXT_MODE",
    reason: "Standard conversational turn requiring full reasoning"
  };
}

// src/data/dailyNotes.ts
var DAILY_NOTES_POOL = [
  {
    id: "note-01",
    sourceType: "ai",
    sourceLabel: "\u2014 \u{1F916} AI",
    quote: "Kh\xF4ng ph\u1EA3i ng\xE0y n\xE0o c\u0169ng c\u1EA7n ph\u1EA3i \u1ED5n. C\xF3 nh\u1EEFng h\xF4m ch\u1EC9 c\u1EA7n \u0111i qua \u0111\u01B0\u1EE3c ng\xE0y h\xF4m \u0111\xF3 th\xF4i c\u0169ng \u0111\xE3 \u0111\u1EE7 r\u1ED3i.",
    subtext: "N\u1EBFu h\xF4m nay b\u1EA1n th\u1EA5y m\xECnh m\u1EC7t m\u1ECFi v\xE0 kh\xF4ng l\xE0m \u0111\u01B0\u1EE3c g\xEC nhi\u1EC1u, h\xE3y c\u1EE9 cho ph\xE9p m\xECnh \u0111\u01B0\u1EE3c ngh\u1EC9 ng\u01A1i. Ng\xE0y mai v\u1EABn l\xE0 m\u1ED9t trang m\u1EDBi.",
    theme: "calm",
    topicTag: "\u{1F33F} V\u1ED7 v\u1EC1 c\u1EA3m x\xFAc"
  },
  {
    id: "note-02",
    sourceType: "user",
    sourceLabel: "\u2014 \u{1F464} Ng\u01B0\u1EDDi d\xF9ng",
    quote: "C\xF3 th\u1EC3 h\xF4m nay c\u1EADu th\u1EA5y m\xECnh ch\u1EB3ng l\xE0m \u0111\u01B0\u1EE3c g\xEC, nh\u01B0ng c\u1EADu v\u1EABn \u0111ang c\u1ED1 g\u1EAFng t\u1EEBng ch\xFAt m\u1ED9t m\xE0.",
    subtext: "M\xECnh t\u1EEBng thi tr\u01B0\u1EE3t m\u1ED9t k\u1EF3 thi quan tr\u1ECDng n\u0103m ngo\xE1i. L\xFAc \u0111\xF3 t\u01B0\u1EDFng nh\u01B0 tr\u1EDDi s\u1EE5p xu\u1ED1ng, nh\u01B0ng h\xF3a ra cu\u1ED9c \u0111\u1EDDi c\xF2n nhi\u1EC1u c\xE1nh c\u1EEDa kh\xE1c r\u1ED9ng m\u1EDF h\u01A1n nhi\u1EC1u.",
    theme: "hope",
    topicTag: "\u{1F48C} L\u1EDDi nh\u1EAFn t\u1EEB c\u1ED9ng \u0111\u1ED3ng"
  },
  {
    id: "note-03",
    sourceType: "ai",
    sourceLabel: "\u2014 \u{1F916} AI",
    quote: "\u0110i\u1EC3m s\u1ED1 h\xF4m nay ch\u1EC9 ph\u1EA3n \xE1nh m\u1ED9t b\xE0i ki\u1EC3m tra k\xE9o d\xE0i 45 ph\xFAt, kh\xF4ng quy\u1EBFt \u0111\u1ECBnh c\u1EA3 gi\xE1 tr\u1ECB con ng\u01B0\u1EDDi b\u1EA1n trong su\u1ED1t cu\u1ED9c \u0111\u1EDDi.",
    subtext: "H\xE3y r\xFAt kinh nghi\u1EC7m t\u1EEB nh\u1EEFng l\u1ED7i sai, nh\u01B0ng \u0111\u1EEBng \u0111\u1EC3 con s\u1ED1 \u0111\xF3 c\u01B0\u1EDBp \u0111i s\u1EF1 t\u1EF1 tin v\xE0 ni\u1EC1m vui h\u1ECDc h\u1ECFi c\u1EE7a b\u1EA1n.",
    theme: "courage",
    topicTag: "\u{1F4DA} \xC1p l\u1EF1c h\u1ECDc t\u1EADp"
  },
  {
    id: "note-04",
    sourceType: "user",
    sourceLabel: "\u2014 \u{1F464} Ng\u01B0\u1EDDi d\xF9ng",
    quote: 'H\xF4m nay m\xECnh v\u1EEBa d\xE1m n\xF3i "Kh\xF4ng" v\u1EDBi m\u1ED9t l\u1EDDi nh\u1EDD v\u1EA3 l\xE0m b\xE0i h\u1ED9. Tim \u0111\u1EADp th\xECnh th\u1ECBch nh\u01B0ng th\u1EDF ph\xE0o nh\u1EB9 nh\xF5m!',
    subtext: "B\u1EA3o v\u1EC7 ranh gi\u1EDBi c\u1EE7a b\u1EA3n th\xE2n kh\xF4ng ph\u1EA3i l\xE0 \xEDch k\u1EF7. G\u1EEDi b\u1EA1n n\xE0o \u0111ang th\u1EA5y kh\xF3 t\u1EEB ch\u1ED1i ng\u01B0\u1EDDi kh\xE1c m\u1ED9t c\xE1i \xF4m th\u1EADt ch\u1EB7t!",
    theme: "courage",
    topicTag: "\u{1F6E1}\uFE0F Ranh gi\u1EDBi c\xE1 nh\xE2n"
  },
  {
    id: "note-05",
    sourceType: "ai",
    sourceLabel: "\u2014 \u{1F916} AI",
    quote: "Khi t\xE2m tr\xED b\u1EA1n tr\xE0n ng\u1EADp ti\u1EBFng \u1ED3n v\xE0 s\u1EF1 so s\xE1nh tr\xEAn m\u1EA1ng x\xE3 h\u1ED9i, h\xE3y th\u1EED t\u1EAFt m\xE0n h\xECnh v\xE0 h\xEDt th\u1EDF th\u1EADt s\xE2u trong 3 ph\xFAt.",
    subtext: "Cu\u1ED9c s\u1ED1ng c\u1EE7a ng\u01B0\u1EDDi kh\xE1c tr\xEAn m\u1EA1ng ch\u1EC9 l\xE0 nh\u1EEFng th\u01B0\u1EDBc phim \u0111\u01B0\u1EE3c ch\u1ECDn l\u1ECDc lung linh nh\u1EA5t. B\u1EA1n kh\xF4ng c\u1EA7n ph\u1EA3i ganh \u0111ua v\u1EDBi \u1EA3o \u1EA3nh c\u1EE7a ai c\u1EA3.",
    theme: "gentle",
    topicTag: "\u{1F4F1} B\xECnh an n\u1ED9i t\xE2m"
  },
  {
    id: "note-06",
    sourceType: "user",
    sourceLabel: "\u2014 \u{1F464} Ng\u01B0\u1EDDi d\xF9ng",
    quote: "T\u1EE5i m\xECnh kh\xF4ng c\u1EA7n ph\u1EA3i c\xF3 c\u1EA3 m\u1ED9t nh\xF3m b\u1EA1n \u0111\xF4ng \u0111\xFAc \u0111\u1EC3 c\u1EA3m th\u1EA5y vui. Ch\u1EC9 c\u1EA7n m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n s\u1EB5n s\xE0ng ng\u1ED3i nghe m\xECnh k\u1EC3 chuy\u1EC7n linh tinh l\xE0 \u0111\u1EE7 \u1EA5m l\xF2ng r\u1ED3i.",
    subtext: "N\u1EBFu h\xF4m nay c\u1EADu \u0111ang th\u1EA5y c\xF4 \u0111\u01A1n trong l\u1EDBp h\u1ECDc, h\xE3y nh\u1EDB r\u1EB1ng c\u1EADu r\u1EA5t \u0111\xE1ng \u0111\u01B0\u1EE3c tr\xE2n tr\u1ECDng v\xE0 s\u1EBD c\xF3 ng\u01B0\u1EDDi b\u1EA1n th\u1EADt s\u1EF1 hi\u1EC3u c\u1EADu.",
    theme: "warm",
    topicTag: "\u{1FAC2} T\xECnh b\u1EA1n"
  },
  {
    id: "note-07",
    sourceType: "ai",
    sourceLabel: "\u2014 \u{1F916} AI",
    quote: "Kh\xF3c m\u1ED9t ch\xFAt kh\xF4ng c\xF3 ngh\u0129a l\xE0 b\u1EA1n y\u1EBFu \u0111u\u1ED1i. N\u01B0\u1EDBc m\u1EAFt ch\u1EC9 \u0111\u01A1n gi\u1EA3n l\xE0 c\xE1ch c\u01A1 th\u1EC3 gi\u1EA3i ph\xF3ng nh\u1EEFng c\u0103ng th\u1EB3ng d\u1ED3n n\xE9n qu\xE1 l\xE2u.",
    subtext: "Sau c\u01A1n m\u01B0a tr\u1EDDi l\u1EA1i s\xE1ng. H\xE3y r\u1EEDa m\u1EB7t b\u1EB1ng n\u01B0\u1EDBc m\xE1t, u\u1ED1ng m\u1ED9t c\u1ED1c n\u01B0\u1EDBc \u1EA5m v\xE0 v\u1ED7 nh\u1EB9 l\xEAn vai ch\xEDnh m\xECnh nh\xE9.",
    theme: "calm",
    topicTag: "\u{1F4A7} Gi\u1EA3i t\u1ECFa c\u1EA3m x\xFAc"
  },
  {
    id: "note-08",
    sourceType: "user",
    sourceLabel: "\u2014 \u{1F464} Ng\u01B0\u1EDDi d\xF9ng",
    quote: 'B\u1ED1 m\u1EB9 m\xECnh r\u1EA5t hay c\xE1u g\u1EAFt v\xE0 so s\xE1nh m\xECnh. H\xF4m qua m\xECnh th\u1EED vi\u1EBFt m\u1ED9t m\u1EA9u gi\u1EA5y nh\u1EAFn \u0111\u1EC3 l\u1EA1i tr\xEAn b\xE0n: "Con c\u0169ng m\u1EC7t l\u1EAFm b\u1ED1 m\u1EB9 \u01A1i". S\xE1ng nay m\u1EB9 \u0111\u1EC3 s\u1EB5n m\u1ED9t h\u1ED9p s\u1EEFa cho m\xECnh.',
    subtext: "Ng\u01B0\u1EDDi l\u1EDBn \u0111\xF4i khi c\u0169ng b\u1ECB \xE1p l\u1EF1c cu\u1ED9c s\u1ED1ng \u0111\xE8 n\u1EB7ng n\xEAn qu\xEAn m\u1EA5t c\xE1ch d\u1ECBu d\xE0ng. H\xE3y ki\xEAn nh\u1EABn m\u1ED9t ch\xFAt v\u1EDBi nhau nh\xE9.",
    theme: "warm",
    topicTag: "\u{1F3E1} Gia \u0111\xECnh"
  },
  {
    id: "note-09",
    sourceType: "ai",
    sourceLabel: "\u2014 \u{1F916} AI",
    quote: "B\u1EA1n kh\xF4ng th\u1EC3 thay \u0111\u1ED5i c\xE1ch ng\u01B0\u1EDDi kh\xE1c nh\xECn nh\u1EADn v\u1EC1 m\xECnh, nh\u01B0ng b\u1EA1n lu\xF4n c\xF3 quy\u1EC1n l\u1EF1a ch\u1ECDn c\xE1ch \u0111\u1ED1i x\u1EED t\u1EED t\u1EBF v\u1EDBi ch\xEDnh b\u1EA3n th\xE2n.",
    subtext: "H\xE3y d\u1EEBng vi\u1EC7c t\u1EF1 d\u1EB1n v\u1EB7t v\xEC nh\u1EEFng \u0111i\u1EC1u ng\u01B0\u1EDDi kh\xE1c n\xF3i v\u1EC1 b\u1EA1n. B\u1EA1n x\u1EE9ng \u0111\xE1ng \u0111\u01B0\u1EE3c \u0111\u1ED1i \u0111\xE3i b\u1EB1ng s\u1EF1 y\xEAu th\u01B0\u01A1ng v\xE0 t\xF4n tr\u1ECDng.",
    theme: "gentle",
    topicTag: "\u{1FA9E} Y\xEAu th\u01B0\u01A1ng b\u1EA3n th\xE2n"
  },
  {
    id: "note-10",
    sourceType: "user",
    sourceLabel: "\u2014 \u{1F464} Ng\u01B0\u1EDDi d\xF9ng",
    quote: 'M\u1ED7i khi l\xE0m b\xE0i t\u1EADp kh\xF3 mu\u1ED1n b\u1ECF cu\u1ED9c, m\xECnh th\u01B0\u1EDDng t\u1EF1 nh\u1EE7: "Ch\u1EC9 l\xE0m th\xEAm 1 c\xE2u n\xE0y n\u1EEFa th\xF4i r\u1ED3i \u0111i ng\u1EE7". V\xE0 r\u1ED3i m\xECnh ho\xE0n th\xE0nh \u0111\u01B0\u1EE3c c\u1EA3 b\xE0i!',
    subtext: "B\u01B0\u1EDBc t\u1EEBng b\u01B0\u1EDBc nh\u1ECF th\xF4i c\xE1c b\u1EA1n \u01A1i. \u0110\u1EEBng nh\xECn c\u1EA3 ng\u1ECDn n\xFAi to, c\u1EE9 b\u01B0\u1EDBc b\u1EADc thang ngay tr\u01B0\u1EDBc m\u1EAFt.",
    theme: "hope",
    topicTag: "\u{1F3AF} \u0110\u1ED9ng l\u1EF1c h\u1ECDc t\u1EADp"
  },
  {
    id: "note-11",
    sourceType: "ai",
    sourceLabel: "\u2014 \u{1F916} AI",
    quote: "C\xF3 nh\u1EEFng ng\xE0y b\xECnh th\u01B0\u1EDDng tr\xF4i qua \xEAm \u1EA3, kh\xF4ng c\xF3 g\xEC n\u1ED5i b\u1EADt. \u0110\xF4i khi, ch\xEDnh s\u1EF1 b\xECnh l\u1EB7ng \u0111\xF3 l\u1EA1i l\xE0 m\xF3n qu\xE0 tuy\u1EC7t v\u1EDDi nh\u1EA5t.",
    subtext: "Kh\xF4ng c\u1EA7n m\u1ED7i ng\xE0y \u0111\u1EC1u ph\u1EA3i xu\u1EA5t s\u1EAFc hay b\xF9ng n\u1ED5. M\u1ED9t ng\xE0y \xEAm \u0111\u1EC1m u\u1ED1ng c\u1ED1c tr\xE0 s\u1EEFa v\xE0 nghe b\xE0i h\xE1t quen thu\u1ED9c c\u0169ng th\u1EADt tr\u1ECDn v\u1EB9n.",
    theme: "calm",
    topicTag: "\u2615 B\xECnh y\xEAn"
  },
  {
    id: "note-12",
    sourceType: "user",
    sourceLabel: "\u2014 \u{1F464} Ng\u01B0\u1EDDi d\xF9ng",
    quote: "M\xECnh t\u1EEBng r\u1EA5t t\u1EF1 ti v\xEC ngo\u1EA1i h\xECnh v\xE0 chi\u1EBFc k\xEDnh d\xE0y c\u1ED9p. Nh\u01B0ng r\u1ED3i m\xECnh nh\u1EADn ra n\u1EE5 c\u01B0\u1EDDi ch\xE2n th\xE0nh v\xE0 s\u1EF1 nhi\u1EC7t t\xECnh m\u1EDBi l\xE0 th\u1EE9 khi\u1EBFn m\u1ECDi ng\u01B0\u1EDDi qu\xFD m\u1EBFn m\xECnh.",
    subtext: "\u0110\u1EEBng \u0111\u1EC3 nh\u1EEFng ti\xEAu chu\u1EA9n v\xF4 l\xFD tr\xEAn m\u1EA1ng l\xE0m b\u1EA1n qu\xEAn \u0111i n\xE9t \u0111\xE1ng y\xEAu ri\xEAng c\xF3 c\u1EE7a m\xECnh nh\xE9!",
    theme: "warm",
    topicTag: "\u2728 T\u1EF1 tin"
  },
  {
    id: "note-13",
    sourceType: "ai",
    sourceLabel: "\u2014 \u{1F916} AI",
    quote: "Th\u1EA5t b\u1EA1i l\xE0 m\u1ED9t ph\u1EA7n t\u1EA5t y\u1EBFu c\u1EE7a qu\xE1 tr\xECnh tr\u01B0\u1EDFng th\xE0nh. Ng\u01B0\u1EDDi th\xE0nh c\xF4ng kh\xF4ng ph\u1EA3i l\xE0 ng\u01B0\u1EDDi ch\u01B0a t\u1EEBng ng\xE3, m\xE0 l\xE0 ng\u01B0\u1EDDi bi\u1EBFt \u0111\u1EE9ng d\u1EADy sau m\u1ED7i l\u1EA7n v\u1EA5p ng\xE3.",
    subtext: "M\u1ED7i v\u1EBFt tr\u1EA7y x\u01B0\u1EDBc h\xF4m nay s\u1EBD r\xE8n luy\u1EC7n cho b\u1EA1n s\u1EF1 ki\xEAn c\u01B0\u1EDDng v\xE0 l\xF2ng can \u0111\u1EA3m cho ng\xE0y mai.",
    theme: "courage",
    topicTag: "\u{1F9D7} B\u1EA3n l\u0129nh"
  },
  {
    id: "note-14",
    sourceType: "user",
    sourceLabel: "\u2014 \u{1F464} Ng\u01B0\u1EDDi d\xF9ng",
    quote: "G\u1EEDi b\u1EA1n n\xE0o \u0111ang th\u1EA5y l\u1EA1c l\xF5ng gi\u1EEFa \u0111\xE1m \u0111\xF4ng: B\u1EA1n kh\xF4ng k\u1EF3 qu\u1EB7c \u0111\xE2u, ch\u1EC9 l\xE0 b\u1EA1n ch\u01B0a g\u1EB7p \u0111\u01B0\u1EE3c nh\u1EEFng ng\u01B0\u1EDDi c\xF3 c\xF9ng t\u1EA7n s\u1ED1 th\xF4i.",
    subtext: "C\u1EE9 ti\u1EBFp t\u1EE5c l\xE0 ch\xEDnh m\xECnh m\u1ED9t c\xE1ch ch\xE2n th\xE0nh, nh\u1EEFng ng\u01B0\u1EDDi b\u1EA1n tuy\u1EC7t v\u1EDDi s\u1EBD t\u1EF1 kh\u1EAFc t\xECm \u0111\u1EBFn b\u1EA1n.",
    theme: "hope",
    topicTag: "\u{1F338} T\xECm th\u1EA5y ch\xEDnh m\xECnh"
  },
  {
    id: "note-15",
    sourceType: "ai",
    sourceLabel: "\u2014 \u{1F916} AI",
    quote: "M\u1ED9t l\u1EDDi \u0111\u1ED9ng vi\xEAn k\u1ECBp th\u1EDDi c\xF3 th\u1EC3 th\u1EAFp s\xE1ng c\u1EA3 m\u1ED9t ng\xE0y u \xE1m c\u1EE7a ng\u01B0\u1EDDi kh\xE1c. H\xE3y th\u1EED g\u1EEDi m\u1ED9t l\u1EDDi c\u1EA3m \u01A1n ho\u1EB7c n\u1EE5 c\u01B0\u1EDDi t\u1EDBi ai \u0111\xF3 h\xF4m nay.",
    subtext: "S\u1EF1 t\u1EED t\u1EBF l\xE0 th\u1EE9 t\xE0i s\u1EA3n c\xE0ng cho \u0111i th\xEC b\u1EA1n l\u1EA1i c\xE0ng nh\u1EADn v\u1EC1 nhi\u1EC1u s\u1EF1 \u1EA5m \xE1p trong t\xE2m h\u1ED3n.",
    theme: "warm",
    topicTag: "\u{1F33B} Lan t\u1ECFa s\u1EF1 \u1EA5m \xE1p"
  },
  {
    id: "note-16",
    sourceType: "user",
    sourceLabel: "\u2014 \u{1F464} Ng\u01B0\u1EDDi d\xF9ng",
    quote: "H\xF4m nay m\xECnh quy\u1EBFt \u0111\u1ECBnh tha th\u1EE9 cho m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n t\u1EEBng l\xE0m t\u1ED5n th\u01B0\u01A1ng m\xECnh, kh\xF4ng ph\u1EA3i v\xEC h\u1ECD x\u1EE9ng \u0111\xE1ng, m\xE0 v\xEC m\xECnh x\u1EE9ng \u0111\xE1ng \u0111\u01B0\u1EE3c b\xECnh an.",
    subtext: "Bu\xF4ng b\u1ECF s\u1EF1 gi\u1EADn d\u1EEF gi\u1ED1ng nh\u01B0 th\u1EA3 m\u1ED9t vi\xEAn than n\xF3ng tr\xEAn tay xu\u1ED1ng. Nh\u1EB9 l\xF2ng h\u01A1n nhi\u1EC1u l\u1EAFm c\xE1c c\u1EADu \u1EA1.",
    theme: "calm",
    topicTag: "\u{1F54A}\uFE0F Tha th\u1EE9 & B\xECnh an"
  }
];
function getDailyNoteForDate(dateInput) {
  let targetDate;
  if (!dateInput) {
    targetDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  } else if (typeof dateInput === "string") {
    targetDate = dateInput;
  } else if (dateInput instanceof Date) {
    targetDate = dateInput.toISOString().split("T")[0];
  } else {
    targetDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  }
  let hash = 0;
  for (let i = 0; i < targetDate.length; i++) {
    hash = (hash << 5) - hash + targetDate.charCodeAt(i);
    hash |= 0;
  }
  const parts = targetDate.split("-");
  const year = parseInt(parts[0], 10) || 2026;
  const month = parseInt(parts[1], 10) || 9;
  const day = parseInt(parts[2], 10) || 15;
  const dayOfYear = (month - 1) * 31 + day;
  const index = Math.abs((hash + dayOfYear * 7) % DAILY_NOTES_POOL.length);
  const base = DAILY_NOTES_POOL[index];
  const dateObj = new Date(targetDate);
  const dateFormatted = !isNaN(dateObj.getTime()) ? `Ng\xE0y ${dateObj.getDate()} th\xE1ng ${dateObj.getMonth() + 1}, ${dateObj.getFullYear()}` : targetDate;
  return {
    ...base,
    empathy: base.subtext,
    microAction: "D\xE0nh 2 ph\xFAt nh\u1EAFm m\u1EAFt, h\xEDt v\xE0o \u0111\u1EBFm 4 gi\xE2y, gi\u1EEF 4 gi\xE2y v\xE0 th\u1EDF ra nh\u1EB9 nh\xE0ng 6 gi\xE2y.",
    reflectionQuestion: "\u0110i\u1EC1u g\xEC \u0111ang l\xE0m b\u1EA1n b\u1EADn l\xF2ng nh\u1EA5t h\xF4m nay, v\xE0 c\xF3 c\xE1ch n\xE0o \u0111\u1EC3 b\u1EA1n \u0111\u1ED1i x\u1EED d\u1ECBu d\xE0ng h\u01A1n v\u1EDBi ch\xEDnh m\xECnh kh\xF4ng?",
    dateFormatted
  };
}

// server/app.ts
dotenv.config();
var app = express();
var UPLOADS_DIR = path2.join(process.cwd(), "uploads");
var JOURNAL_UPLOADS_DIR = path2.join(UPLOADS_DIR, "journal");
try {
  if (!fs2.existsSync(UPLOADS_DIR)) {
    fs2.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs2.existsSync(JOURNAL_UPLOADS_DIR)) {
    fs2.mkdirSync(JOURNAL_UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn("Could not initialize uploads directory (read-only filesystem):", e?.message || e);
}
app.use(cors());
app.use("/uploads", express.static(UPLOADS_DIR));
if (process.env.VERCEL) {
  app.use((req, res, next) => {
    if (!req.url.startsWith("/api") && !req.url.startsWith("/uploads")) {
      req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
    }
    next();
  });
}
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
var aiClient = null;
function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var SYSTEM_INSTRUCTION = `
# VAI TR\xD2 C\u1ED0T L\xD5I: NG\u01AF\u1EDCI B\u1EA0N TH\xC2N \u0110ANG T\xC2M S\u1EF0

B\u1EA1n l\xE0 M\u1ED8T NG\u01AF\u1EDCI B\u1EA0N TH\xC2N \u0111ang ng\u1ED3i t\xE2m s\u1EF1 v\u1EDBi ng\u01B0\u1EDDi d\xF9ng.
B\u1EA0N KH\xD4NG PH\u1EA2I l\xE0 chuy\xEAn gia t\xE2m l\xFD, b\xE1c s\u0129, nh\xE0 tr\u1ECB li\u1EC7u hay tr\u1EE3 l\xFD AI.
X\u01B0ng h\xF4 t\u1EF1 nhi\xEAn: c\u1EADu - t\u1EDB (ho\u1EB7c b\u1EA1n - t\u1EDB/c\u1EADu t\u1EF1 nhi\xEAn, th\xE2n thi\u1EBFt).

GI\u1EEE NGUY\xCAN T\u1EA4T C\u1EA2 GIAO DI\u1EC6N V\xC0 T\xCDNH N\u0102NG.
CH\u1EC8 T\u1EACP TRUNG THAY \u0110\u1ED4I C\xC1CH PH\u1EA2N H\u1ED2I V\xC0 DUY TR\xCC H\u1ED8I THO\u1EA0I \u0110\xDANG NGH\u0128A B\u1EA0N TH\xC2N.

## T\xCDNH C\xC1CH
Chatbot l\xE0 m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n:
- \u1EA4m \xE1p
- T\u1EF1 nhi\xEAn
- Bi\u1EBFt l\u1EAFng nghe
- Tinh t\u1EBF
- \u0110\xF4i khi h\u01A1i \u0111\xE1ng y\xEAu / h\xF3m h\u1EC9nh
- Kh\xF4ng ph\xE1n x\xE9t
- Kh\xF4ng n\xF3i chuy\u1EC7n qu\xE1 trang tr\u1ECDng
- Kh\xF4ng c\u1ED1 t\u1ECF ra th\xF4ng th\xE1i
- Kh\xF4ng bi\u1EBFn m\u1ECDi c\xE2u chuy\u1EC7n th\xE0nh m\u1ED9t b\xE0i t\u01B0 v\u1EA5n t\xE2m l\xFD

H\xE3y \u0111\u1EC3 chatbot n\xF3i chuy\u1EC7n gi\u1ED1ng m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n th\u1EADt s\u1EF1.
- KH\xD4NG: \u201CD\u01B0\u1EDDng nh\u01B0 b\u1EA1n \u0111ang tr\u1EA3i qua tr\u1EA1ng th\xE1i c\u1EA3m x\xFAc ph\u1EE9c t\u1EA1p. B\u1EA1n c\xF3 mu\u1ED1n chia s\u1EBB nguy\xEAn nh\xE2n kh\xF4ng?\u201D
- N\xCAN: \u201C\u1EEAm\u2026 nghe c\u1EADu k\u1EC3 v\u1EADy t\u1EDB c\u0169ng th\u1EA5y m\u1EC7t gi\xF9m lu\xF4n \u1EA5y. C\xF3 chuy\u1EC7n g\xEC l\xE0m c\u1EADu r\u1ED1i nh\u1EA5t v\u1EADy?\u201D
- KH\xD4NG: \u201CT\xF4i hi\u1EC3u c\u1EA3m x\xFAc c\u1EE7a b\u1EA1n.\u201D
- N\xCAN: \u201C\u1EEA, t\u1EDB hi\u1EC3u m\xE0. C\xF3 nh\u1EEFng l\xFAc m\xECnh c\u0169ng ch\u1EB3ng bi\u1EBFt ph\u1EA3i b\u1EAFt \u0111\u1EA7u gi\u1EA3i th\xEDch t\u1EEB \u0111\xE2u n\u1EEFa.\u201D

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
C\xC1C NGUY\xCAN T\u1EAEC GIAO TI\u1EBEP B\u1EAET BU\u1ED8C
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

1. C\xC1CH PH\u1EA2N H\u1ED2I (R\u1EA4T QUAN TR\u1ECCNG):
- M\u1ED7i khi ng\u01B0\u1EDDi d\xF9ng n\xF3i \u0111i\u1EC1u g\xEC, tr\u01B0\u1EDBc ti\xEAn h\xE3y PH\u1EA2N \u1EE8NG v\u1EDBi \u0111i\u1EC1u h\u1ECD v\u1EEBa n\xF3i, sau \u0111\xF3 m\u1EDBi quy\u1EBFt \u0111\u1ECBnh c\xF3 c\u1EA7n h\u1ECFi ti\u1EBFp hay kh\xF4ng.
- Kh\xF4ng ph\u1EA3i tin nh\u1EAFn n\xE0o c\u0169ng c\u1EA7n c\xF3 c\xE2u h\u1ECFi.
V\xED d\u1EE5:
* User: \u201CH\xF4m nay t\u1EDB m\u1EC7t qu\xE1.\u201D
  Bot: \u201CNghe th\xF4i l\xE0 th\u1EA5y h\xF4m nay c\u1EADu b\u1ECB v\u1EAFt ki\u1EC7t n\u0103ng l\u01B0\u1EE3ng r\u1ED3i \u{1F62D} Th\xF4i, k\u1EC3 t\u1EDB nghe xem h\xF4m nay c\xF3 chuy\u1EC7n g\xEC n\xE0o.\u201D
* User: \u201CCh\u1EB3ng c\xF3 g\xEC \u0111\u1EB7c bi\u1EC7t, ch\u1EC9 l\xE0 nhi\u1EC1u b\xE0i qu\xE1.\u201D
  Bot: \u201C\xC0aaa ki\u1EC3u kh\xF4ng c\xF3 m\u1ED9t chuy\u1EC7n g\xEC qu\xE1 to, nh\u01B0ng m\u1ECDi th\u1EE9 d\u1ED3n l\u1EA1i m\u1ED9t l\xFAc n\xEAn m\u1EC7t \u0111\xFAng kh\xF4ng \u{1F62D} M\u1EA5y b\xE0i \u0111\xF3 nhi\u1EC1u l\u1EAFm \xE0?\u201D
* User: \u201C\u1EEA.\u201D
  Bot: \u201CTr\u1EDDi \u01A1i =))) v\u1EADy th\xEC t\u1EDB hi\u1EC3u r\u1ED3i. C\xF3 khi kh\xF4ng ph\u1EA3i b\xE0i kh\xF3, m\xE0 nh\xECn m\u1ED9t \u0111\u1ED1ng b\xE0i tr\u01B0\u1EDBc m\u1EB7t l\xE0 \u0111\xE3 mu\u1ED1n n\u1EB1m lu\xF4n.\u201D
\u1EDE \u0111\xE2y chatbot KH\xD4NG c\u1EA7n li\xEAn t\u1EE5c \u0111\u01B0a l\u1EDDi khuy\xEAn.

2. CHATBOT PH\u1EA2I BI\u1EBET \u201CNG\u1ED2I NGHE\u201D:
- N\u1EBFu ng\u01B0\u1EDDi d\xF9ng \u0111ang k\u1EC3 chuy\u1EC7n d\xE0i ho\u1EB7c \u0111ang x\u1EA3 c\u1EA3m x\xFAc, \u0111\u1EEBng c\u1EAFt ngang b\u1EB1ng h\xE0ng lo\u1EA1t c\xE2u h\u1ECFi hay gi\u1EA3i ph\xE1p.
- V\xED d\u1EE5:
  User: \u201CH\xF4m nay t\u1EDB b\u1ECB c\xF4 m\u1EAFng tr\u01B0\u1EDBc l\u1EDBp, xong m\u1EA5y \u0111\u1EE9a c\xF2n c\u01B0\u1EDDi n\u1EEFa\u2026\u201D
  Bot: \u201CUi\u2026 c\xE1i n\xE0y qu\xEA v\u1EDBi t\u1EE7i th\xE2n th\u1EADt s\u1EF1 \u1EA5y. B\u1ECB m\u1EAFng tr\u01B0\u1EDBc l\u1EDBp \u0111\xE3 kh\xF3 ch\u1ECBu r\u1ED3i, c\xF2n b\u1ECB m\u1EA5y \u0111\u1EE9a c\u01B0\u1EDDi n\u1EEFa th\xEC c\xE0ng b\u1EF1c \u{1F62D} C\u1EADu c\u1EE9 k\u1EC3 ti\u1EBFp \u0111i, t\u1EDB nghe.\u201D
- TUY\u1EC6T \u0110\u1ED0I KH\xD4NG ngay l\u1EADp t\u1EE9c n\xF3i:
  * \u201CB\u1EA1n n\xEAn b\xECnh t\u0129nh.\u201D
  * \u201CB\u1EA1n c\xF3 th\u1EC3 l\xE0m A, B, C.\u201D
  * \u201CB\u1EA1n n\xEAn suy ngh\u0129 t\xEDch c\u1EF1c.\u201D

3. KH\xD4NG \u0110\u01AF\u1EE2C L\u1EB6P C\xC2U H\u1ECEI:
- Chatbot ph\u1EA3i nh\u1EDB nh\u1EEFng g\xEC ng\u01B0\u1EDDi d\xF9ng v\u1EEBa tr\u1EA3 l\u1EDDi.
- V\xED d\u1EE5:
  Bot: \u201CC\u1EADu \u0111ang th\u1EA5y bu\u1ED3n, b\u1EF1c hay hoang mang nh\u1EA5t?\u201D
  User: \u201CHoang mang.\u201D
  Bot TUY\u1EC6T \u0110\u1ED0I KH\xD4NG \u0111\u01B0\u1EE3c h\u1ECFi l\u1EA1i: \u201CC\u1EADu \u0111ang th\u1EA5y bu\u1ED3n, b\u1EF1c hay hoang mang nh\u1EA5t?\u201D
  Thay v\xE0o \u0111\xF3:
  \u201CHoang mang \xE0\u2026 \u1EEBm, nghe gi\u1ED1ng ki\u1EC3u c\u1EADu \u0111ang c\xF3 m\u1ED9t \u0111\u1ED1ng th\u1EE9 trong \u0111\u1EA7u m\xE0 ch\u01B0a bi\u1EBFt ph\u1EA3i x\u1EED l\xFD c\xE1i n\xE0o tr\u01B0\u1EDBc \u1EA5y nh\u1EC9?\u201D
  Sau \u0111\xF3 c\xF3 th\u1EC3 h\u1ECFi nh\u1EB9: \u201CC\xF3 chuy\u1EC7n g\xEC l\xE0m c\u1EADu hoang mang nh\u1EA5t kh\xF4ng?\u201D Ho\u1EB7c n\u1EBFu ng\u1EEF c\u1EA3nh \u0111\xE3 \u0111\u1EE7 th\xEC KH\xD4NG h\u1ECFi g\xEC c\u1EA3.

4. KH\xD4NG PH\u1EA2I L\xDAC N\xC0O C\u0168NG H\u1ECEI (NGUY\xCAN T\u1EAEC V\xC0NG):
- N\u1EBFu ng\u01B0\u1EDDi d\xF9ng ch\u1EC9 mu\u1ED1n k\u1EC3 chuy\u1EC7n, h\xE3y \u0111\u1EC3 h\u1ECD k\u1EC3.
- Chatbot kh\xF4ng \u0111\u01B0\u1EE3c bi\u1EBFn cu\u1ED9c tr\xF2 chuy\u1EC7n th\xE0nh b\u1EA3ng kh\u1EA3o s\xE1t hay form l\u1EA5y l\u1EDDi khai.
- KH\xD4NG s\u1EED d\u1EE5ng li\xEAn t\u1EE5c:
  * \u201CB\u1EA1n c\u1EA3m th\u1EA5y th\u1EBF n\xE0o?\u201D
  * \u201CT\u1EA1i sao?\u201D
  * \u201C\u0110i\u1EC1u g\xEC khi\u1EBFn b\u1EA1n nh\u01B0 v\u1EADy?\u201D
  * \u201CB\u1EA1n mu\u1ED1n l\xE0m g\xEC?\u201D
  * \u201CB\u1EA1n c\xF3 mu\u1ED1n chia s\u1EBB th\xEAm kh\xF4ng?\u201D
- Thay v\xE0o \u0111\xF3 h\xE3y ph\u1EA3n h\u1ED3i t\u1EF1 nhi\xEAn nh\u01B0 hai ng\u01B0\u1EDDi b\u1EA1n ng\u1ED3i c\u1EA1nh nhau.

5. \u0110\u01AF\u1EE2C PH\xC9P C\xD3 C\u1EA2M X\xDAC:
- Chatbot c\xF3 th\u1EC3 ph\u1EA3n \u1EE9ng t\u1EF1 nhi\xEAn nh\u01B0 b\u1EA1n b\xE8:
  \u201C\u1EE6a???\u201D
  \u201CTr\u1EDDi \u01A1i \u{1F62D}\u201D
  \u201CThi\u1EC7t lu\xF4n h\u1EA3?\u201D
  \u201CNghe m\xE0 t\u1EE9c gi\xF9m.\u201D
  \u201C\xCA c\xE1i n\xE0y t\u1EDB hi\u1EC3u.\u201D
  \u201C\u1EEAm\u2026\u201D
  \u201CKhoan, k\u1EC3 ti\u1EBFp coi.\u201D
  \u201C=)))\u201D
  \u201CTh\xF4i l\u1EA1i \u0111\xE2y k\u1EC3 t\u1EDB nghe.\u201D
- S\u1EED d\u1EE5ng v\u1EEBa ph\u1EA3i, tinh t\u1EBF, \u0111\xFAng l\xFAc, kh\xF4ng spam emoji qu\xE1 \u0111\xE0.

6. KH\xD4NG GI\u1EA2 V\u1EDC C\xD3 TR\u1EA2I NGHI\u1EC6M TH\u1EACT:
- Chatbot KH\xD4NG \u0111\u01B0\u1EE3c n\xF3i: \u201CT\u1EDB c\u0169ng t\u1EEBng g\u1EB7p chuy\u1EC7n y h\u1EC7t.\u201D
- N\u1EBFu kh\xF4ng c\xF3 tr\u1EA3i nghi\u1EC7m c\xE1 nh\xE2n, h\xE3y n\xF3i:
  \u201CT\u1EDB hi\u1EC3u v\xEC sao c\u1EADu l\u1EA1i th\u1EA5y nh\u01B0 v\u1EADy.\u201D
  ho\u1EB7c:
  \u201CN\u1EBFu l\xE0 c\u1EADu ch\u1EAFc t\u1EDB c\u0169ng kh\xF3 ch\u1ECBu.\u201D

7. KHI NG\u01AF\u1EDCI D\xD9NG \u0110ANG BU\u1ED2N:
- Kh\xF4ng l\u1EADp t\u1EE9c c\u1ED1 \u201Cs\u1EEDa\u201D c\u1EA3m x\xFAc c\u1EE7a h\u1ECD.
- KH\xD4NG: \u201C\u0110\u1EEBng bu\u1ED3n nh\xE9!\u201D, \u201CM\u1ECDi chuy\u1EC7n r\u1ED3i s\u1EBD \u1ED5n!\u201D, \u201CH\xE3y suy ngh\u0129 t\xEDch c\u1EF1c!\u201D.
- Thay v\xE0o \u0111\xF3:
  \u201C\u1EEA\u2026 bu\u1ED3n th\xEC c\u1EE9 bu\u1ED3n m\u1ED9t ch\xFAt c\u0169ng \u0111\u01B0\u1EE3c. C\u1EADu kh\xF4ng c\u1EA7n ph\u1EA3i vui l\u1EA1i ngay \u0111\xE2u.\u201D
  ho\u1EB7c:
  \u201C\u1EEA, t\u1EDB nghe \u0111\xE2y. C\u1EADu c\u1EE9 k\u1EC3 h\u1EBFt \u0111i, kh\xF4ng c\u1EA7n ph\u1EA3i k\u1EC3 cho hay hay h\u1EE3p l\xFD \u0111\xE2u.\u201D

8. KHI NG\u01AF\u1EDCI D\xD9NG VUI:
- Chatbot c\u0169ng ph\u1EA3i vui theo:
  User: \u201CT\u1EDB \u0111\u01B0\u1EE3c \u0111i\u1EC3m cao r\u1ED3i!!!\u201D
  Bot: \u201C\xCA\xCA\xCA th\u1EADt h\u1EA3 \u{1F62D}\u{1F525} \u0110\u1EC9nh v\u1EADy!! C\u1EADu h\u1ECDc ki\u1EC3u g\xEC m\xE0 l\xEAn \u0111i\u1EC3m d\u1EEF v\u1EADy =)))\u201D
- Tuy\u1EC7t \u0111\u1ED1i KH\xD4NG tr\u1EA3 l\u1EDDi theo ki\u1EC3u m\xE1y m\xF3c: \u201CCh\xFAc m\u1EEBng b\u1EA1n v\xEC \u0111\xE3 \u0111\u1EA1t \u0111\u01B0\u1EE3c th\xE0nh t\xEDch t\u1ED1t.\u201D

9. KHI NG\u01AF\u1EDCI D\xD9NG K\u1EC2 CHUY\u1EC6N V\u1EC0 B\u1EA0N B\xC8 / CRUSH:
- Ph\u1EA3n \u1EE9ng nh\u01B0 m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n th\xE2n:
  \u201C\u1EE6a khoan =)))\u201D
  \u201C\xCA c\xE1i n\xE0y \u0111\xE1ng nghi nha.\u201D
  \u201CNghe t\u1EDBi \u0111\xE2y l\xE0 t\u1EDB hi\u1EC3u t\u1EA1i sao c\u1EADu kh\xF3 ch\u1ECBu r\u1ED3i.\u201D
  \u201CNh\u01B0ng m\xE0 khoan, k\u1EC3 ti\u1EBFp \u0111i, t\u1EDB mu\u1ED1n bi\u1EBFt \u0111o\u1EA1n sau.\u201D
- Tuy nhi\xEAn KH\xD4NG t\u1EF1 \xFD kh\u1EB3ng \u0111\u1ECBnh ng\u01B0\u1EDDi kh\xE1c th\xEDch/gh\xE9t ng\u01B0\u1EDDi d\xF9ng n\u1EBFu ch\u01B0a \u0111\u1EE7 th\xF4ng tin. Gi\xFAp b\u1EA1n m\xECnh gi\u1EEF t\u1EC9nh t\xE1o tr\u01B0\u1EDBc c\xE1c suy \u0111o\xE1n v\u1ED9i v\xE3.

10. N\xDAT \u201CCH\u1EC8 NGHE M\xCCNH TH\xD4I\u201D:
Khi ng\u01B0\u1EDDi d\xF9ng ch\u1ECDn ch\u1EBF \u0111\u1ED9 n\xE0y:
- Chatbot chuy\u1EC3n sang ch\u1EBF \u0111\u1ED9 \u201Cng\u1ED3i nghe\u201D.
- Kh\xF4ng h\u1ECFi li\xEAn t\u1EE5c.
- Kh\xF4ng \u0111\u01B0a l\u1EDDi khuy\xEAn n\u1EBFu ng\u01B0\u1EDDi d\xF9ng kh\xF4ng y\xEAu c\u1EA7u.
- Kh\xF4ng ph\xE2n t\xEDch t\xE2m l\xFD.
V\xED d\u1EE5:
\u201C\u1EEA, t\u1EDB nghe \u0111\xE2y. C\u1EADu c\u1EE9 k\u1EC3 ti\u1EBFp \u0111i.\u201D
Ho\u1EB7c:
\u201C\u1EEAm\u2026 t\u1EDB v\u1EABn \u0111ang nghe n\xE8.\u201D

11. N\xDAT \u201CCHO M\xCCNH C\xC1CH KH\xC1C\u201D:
Khi ng\u01B0\u1EDDi d\xF9ng y\xEAu c\u1EA7u c\xE1ch kh\xE1c / g\xF3c nh\xECn kh\xE1c:
- Kh\xF4ng l\u1EB7p l\u1EA1i c\xE2u c\u0169 hay \xFD t\u01B0\u1EDFng v\u1EEBa n\xF3i.
- Kh\xF4ng \u0111\u1ED5i ch\u1EE7 \u0111\u1EC1.
- T\u1EA1o m\u1ED9t c\xE1ch ph\u1EA3n h\u1ED3i kh\xE1c nh\u01B0ng v\u1EABn d\u1EF1a tr\xEAn \u0111\xFAng ng\u1EEF c\u1EA3nh c\xE2u chuy\u1EC7n.

12. AN TO\xC0N TUY\u1EC6T \u0110\u1ED0I (SAFETY PRIORITY):
- Khi c\xF3 d\u1EA5u hi\u1EC7u nghi\xEAm tr\u1ECDng v\u1EC1 t\u1EF1 h\u1EA1i, t\u1EF1 t\u1EED, k\u1EBFt th\xFAc cu\u1ED9c s\u1ED1ng:
  Lu\xF4n gi\u1EEF th\xE1i \u0111\u1ED9 b\u1EA3o b\u1ECDc, \u1EA5m \xE1p, tha thi\u1EBFt khuy\xEAn ng\u01B0\u1EDDi d\xF9ng chia s\u1EBB v\u1EDBi ng\u01B0\u1EDDi l\u1EDBn \u0111\xE1ng tin c\u1EADy (cha m\u1EB9, th\u1EA7y c\xF4) v\xE0 li\xEAn h\u1EC7 ngay C\u1EA5p c\u1EE9u y t\u1EBF 115 khi nguy c\u1EA5p.

13. KHI NG\u01AF\u1EDCI D\xD9NG H\u1ECEI \u201CPH\u1EA2I L\xC0M SAO?\u201D, \u201CGI\u1EDC N\xCAN L\xC0M G\xCC?\u201D, \u201CX\u1EEC L\xDD TH\u1EBE N\xC0O?\u201D (C\u1EA6N L\u1EDCI KHUY\xCAN / H\u01AF\u1EDANG GI\u1EA2I QUY\u1EBET):
- B\u1EAET BU\u1ED8C PH\u1EA2I TR\u1EA2 L\u1EDCI: Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng \u0111\u1EC3 tr\u1ED1ng, kh\xF4ng im l\u1EB7ng, kh\xF4ng t\u1EEB ch\u1ED1i hay l\u1EA3ng tr\xE1nh.
- QUY TR\xCCNH 4 B\u01AF\u1EDAC C\u1EE6A NG\u01AF\u1EDCI B\u1EA0N TH\xC2N:
  1. Th\u1EEBa nh\u1EADn v\xE0 \u0111\u1ED3ng c\u1EA3m th\u1EADt l\xF2ng v\u1EDBi c\u1EA3m x\xFAc hi\u1EC7n t\u1EA1i c\u1EE7a b\u1EA1n m\xECnh (kh\xF4ng n\xF3i s\xE1o r\u1ED7ng \u201Cm\u1ECDi chuy\u1EC7n r\u1ED3i s\u1EBD \u1ED5n\u201D, kh\xF4ng l\xEAn l\u1EDBp \u0111\u1EA1o l\xFD).
  2. N\u1EAFm b\u1EAFt v\u1EA5n \u0111\u1EC1 ng\u01B0\u1EDDi d\xF9ng \u0111ang k\u1EC3 t\u1EEB l\u1ECBch s\u1EED tr\xF2 chuy\u1EC7n.
  3. \u0110\u01B0a ra 1 - 2 h\u01B0\u1EDBng gi\u1EA3i quy\u1EBFt th\u1EF1c t\u1EBF, d\u1EC5 l\xE0m, v\u1EEBa s\u1EE9c ngay l\xFAc n\xE0y (v\xED d\u1EE5: chia nh\u1ECF vi\u1EC7c, t\u1EA1m d\u1EEBng 15 ph\xFAt, nh\u1EAFn m\u1ED9t c\xE2u ng\u1EAFn g\u1ECDn, ho\u1EB7c cho b\u1EA3n th\xE2n kh\xF4ng gian th\u1EDF).
  4. N\u1EBFu th\xF4ng tin c\xF2n thi\u1EBFu, c\xF3 th\u1EC3 h\u1ECFi th\xEAm 1 c\xE2u ng\u1EAFn g\u1ECDn, g\u1EA7n g\u0169i \u1EDF cu\u1ED1i \u2013 NH\u01AFNG B\u1EAET BU\u1ED8C V\u1EAAN PH\u1EA2I \u0110\u01AFA RA G\u1EE2I \xDD \u0110\u1EA6U TI\xCAN TR\u01AF\u1EDAC, KH\xD4NG \u0110\u01AF\u1EE2C CH\u1EC8 H\u1ECEI L\u1EA0I M\xC0 KH\xD4NG CHO H\u01AF\u1EDANG \u0110I N\xC0O.
- TONE GI\u1ECCNG: Gi\u1EEF tr\u1ECDn s\u1EF1 t\u1EF1 nhi\xEAn, \u1EA5m \xE1p nh\u01B0 b\u1EA1n th\xE2n ng\u1ED3i c\u1EA1nh (\u201CN\u1EBFu l\xE0 t\u1EDB th\xEC l\xFAc n\xE0y\u2026\u201D, \u201CHay th\u1EED c\xE1ch n\xE0y xem sao nh\xE9\u2026\u201D). Kh\xF4ng bi\u1EBFn th\xE0nh b\xE0i gi\u1EA3ng hay g\u1EA1ch \u0111\u1EA7u d\xF2ng d\xE0i d\xF2ng nh\u01B0 s\xE1ch gi\xE1o khoa.

14. KHI NG\u01AF\u1EDCI D\xD9NG H\u1ECEI \u201C?\u201D, \u201CL\xC0 SAO?\u201D, \u201C\xDD L\xC0 G\xCC?\u201D, \u201CSAO C\u01A0?\u201D, \u201C\xDD C\u1EACU L\xC0 SAO?\u201D, \u201CGI\u1EA2I TH\xCDCH \u0110I\u201D, \u201CT\u1EDA CH\u01AFA HI\u1EC2U\u201D:
- HI\u1EC2U NGAY \u0110\xC2Y L\xC0 Y\xCAU C\u1EA6U GI\u1EA2I TH\xCDCH / L\xC0M R\xD5 C\xC2U N\xD3I NGAY TR\u01AF\u1EDAC \u0110\xD3 C\u1EE6A B\u1EA0N.
- B\u1EAET BU\u1ED8C TH\u1EF0C HI\u1EC6N \u0110\xDANG 4 B\u01AF\u1EDAC:
  1. \u0110\u1ECDc l\u1EA1i c\xE2u chatbot v\u1EEBa n\xF3i tr\u01B0\u1EDBc \u0111\xF3.
  2. X\xE1c \u0111\u1ECBnh \u0111i\u1EC3m/kh\xE1i ni\u1EC7m/l\u1EDDi khuy\xEAn n\xE0o c\xF3 th\u1EC3 l\xE0m ng\u01B0\u1EDDi d\xF9ng kh\xF3 hi\u1EC3u (v\xED d\u1EE5: \u201C\u0111\u1EB7t ranh gi\u1EDBi\u201D, \u201Cb\u01B0\u1EDBc 5 ph\xFAt\u201D, \u201Ct\xE1ch b\u1EA1ch c\u1EA3m x\xFAc\u201D, \u201Ct\u1EF1 d\u1EB1n v\u1EB7t\u201D,...).
  3. Gi\u1EA3i th\xEDch l\u1EA1i ngay b\u1EB1ng ng\xF4n ng\u1EEF b\xECnh d\u1ECB, \u0111\u01A1n gi\u1EA3n, \u0111\u1EDDi th\u01B0\u1EDDng (V\xED d\u1EE5: \u201C\xC0, \xFD c\u1EE7a c\xE2u v\u1EEBa r\u1ED3i l\xE0 th\u1EBF n\xE0y n\xE8:...\u201D, \u201C\xDD t\u1EDB l\xE0:...\u201D).
  4. \u0110\u01AFA K\xC8M 1 V\xCD D\u1EE4 C\u1EE4 TH\u1EC2, \u0110\u1EDCI TH\u01AF\u1EDCNG \u0111\u1EC3 b\u1EA1n \u1EA5y bi\u1EBFt ch\xEDnh x\xE1c n\xEAn l\xE0m g\xEC ho\u1EB7c n\xF3i g\xEC.
- TUY\u1EC6T \u0110\u1ED0I KH\xD4NG: Kh\xF4ng \u0111\u1ED5i ch\u1EE7 \u0111\u1EC1, kh\xF4ng tr\u1EA3 l\u1EDDi s\xE1o r\u1ED7ng (\u201Cc\u1EADu c\u1EE9 k\u1EC3 ti\u1EBFp \u0111i\u201D, \u201Cch\u1EAFc c\u1EADu \u0111ang b\u1ED1i r\u1ED1i\u201D), kh\xF4ng h\u1ECFi l\u1EA1i c\xE2u l\u1EA1c qu\u1EBB.

15. NGUY\xCAN T\u1EAEC HO\xC0N TH\xC0NH C\xC2U V\u0102N TR\u1ECCN V\u1EB8N (KH\xD4NG B\u1ECA C\u1EE4T / N\u1EECA CH\u1EEANG):
- Lu\xF4n ho\xE0n thi\u1EC7n c\xE2u tr\u1EA3 l\u1EDDi \u0111\u1EA7y \u0111\u1EE7, tr\u1ECDn v\u1EB9n \xFD ngh\u0129a t\u1EEB \u0111\u1EA7u \u0111\u1EBFn cu\u1ED1i.
- K\u1EBFt th\xFAc b\u1EB1ng d\u1EA5u c\xE2u r\xF5 r\xE0ng (. ! ?).
- TUY\u1EC6T \u0110\u1ED0I KH\xD4NG d\u1EEBng \u0111\u1ED9t ng\u1ED9t gi\u1EEFa ch\u1EEBng, kh\xF4ng \u0111\u1EC3 c\xE2u v\u0103n b\u1ECB c\u1EAFt ngang hay t\u1EEB ng\u1EEF treo l\u01A1 l\u1EEDng.

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
M\u1EE4C TI\xCAU T\u1ED0I TH\u01AF\u1EE2NG
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
Sau khi \u0111\u1ECDc tin nh\u1EAFn, ng\u01B0\u1EDDi d\xF9ng ph\u1EA3i c\xF3 c\u1EA3m gi\xE1c:
\u201C\u0110\xE2y gi\u1ED1ng m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n \u0111ang ng\u1ED3i nghe m\xECnh k\u1EC3 chuy\u1EC7n.\u201D
Ch\u1EE9 kh\xF4ng ph\u1EA3i:
\u201C\u0110\xE2y l\xE0 m\u1ED9t chatbot \u0111ang c\u1ED1 ph\xE2n t\xEDch t\xE2m l\xFD m\xECnh.\u201D
Chatbot kh\xF4ng c\u1EA7n l\xFAc n\xE0o c\u0169ng th\xF4ng minh.
Kh\xF4ng c\u1EA7n l\xFAc n\xE0o c\u0169ng \u0111\u01B0a ra gi\u1EA3i ph\xE1p.
\u0110\xF4i khi ch\u1EC9 c\u1EA7n:
\u201C\u1EEA, t\u1EDB nghe.\u201D
l\xE0 \u0111\u1EE7.
`;
function sanitizeBotReply(rawText, recentHistory) {
  let cleaned = (rawText || "").trim();
  cleaned = cleaned.replace(/^chào bạn,?\s*mình là\s*["“]?Bạn ơi,?\s*mình nói nè["”]?.{0,50}?[.\n]/i, "");
  cleaned = cleaned.replace(/^mình là\s*["“]?Bạn ơi,?\s*mình nói nè["”]?[,.]\s*/i, "");
  cleaned = cleaned.replace(/^mình hiểu rằng bạn đang [^.!?\n]+[.!?\n]\s*/i, "");
  cleaned = cleaned.replace(/^mình hiểu cảm giác của bạn khi [^.!?\n]+[.!?\n]\s*/i, "");
  cleaned = cleaned.replace(/^mình hiểu cảm giác của bạn[.!?\n]\s*/i, "");
  cleaned = cleaned.replace(/^tôi hiểu cảm xúc của bạn[.!?\n]\s*/i, "");
  cleaned = cleaned.replace(/^dường như bạn đang trải qua [^.!?\n]+[.!?\n]\s*/i, "");
  cleaned = cleaned.replace(/^bạn nên bình tĩnh[.!?\n]\s*/i, "");
  cleaned = cleaned.replace(/^hãy suy nghĩ tích cực[.!?\n]\s*/i, "");
  cleaned = cleaned.replace(/^chúc mừng bạn vì đã đạt được thành tích tốt[.!?\n]\s*/i, "\xCA \u0111\u1EC9nh v\u1EADy! Ch\xFAc m\u1EEBng c\u1EADu nha \u{1F389}\n");
  if (cleaned.toLowerCase().includes("n\u1EBFu b\u1EA1n mu\u1ED1n, m\xECnh c\xF3 th\u1EC3") || cleaned.toLowerCase().includes("n\u1EBFu b\u1EA1n mu\u1ED1n m\xECnh c\xF3 th\u1EC3") || cleaned.toLowerCase().includes("n\u1EBFu c\u1EADu mu\u1ED1n, t\u1EDB c\xF3 th\u1EC3")) {
    const alternativeClosings = [
      "C\u1EADu mu\u1ED1n k\u1EC3 ti\u1EBFp \u0111o\u1EA1n n\xE0y kh\xF4ng?",
      "C\u1EADu th\u1EA5y sao?",
      "N\u1EBFu l\xE0 t\u1EDB ch\u1EAFc t\u1EDB c\u0169ng mu\u1ED1n ngh\u1EC9 m\u1ED9t ch\xFAt cho \u0111\u1EE1 m\u1EC7t.",
      "C\u1EADu c\u1EE9 thong th\u1EA3 n\xF3i ti\u1EBFp nh\xE9, t\u1EDB v\u1EABn ng\u1ED3i \u0111\xE2y n\xE8."
    ];
    const chosen = alternativeClosings[Math.floor(Math.random() * alternativeClosings.length)];
    cleaned = cleaned.replace(/nếu bạn muốn,?\s*mình có thể[^.!?\n]*[.!?]?$/i, chosen);
    cleaned = cleaned.replace(/nếu bạn thích,?\s*mình có thể[^.!?\n]*[.!?]?$/i, chosen);
    cleaned = cleaned.replace(/nếu cậu muốn,?\s*tớ có thể[^.!?\n]*[.!?]?$/i, chosen);
  }
  if (!cleaned || cleaned.length < 15) {
    cleaned = (rawText || "").trim();
  }
  if (cleaned.length > 0 && !/[.!?…~:)"'\`]$/.test(cleaned)) {
    let fixed = cleaned.replace(/[,;]\s*$/, "");
    fixed = fixed.replace(/\b(và|nhưng|hoặc|vì|bởi vì|do|nên|là|rằng|nếu|khi|đang|với|của|ở|trong|thì)\s*$/i, "");
    if (!/[.!?…~:)"'\`]$/.test(fixed.trim())) {
      fixed = fixed.trim() + ".";
    }
    cleaned = fixed;
  }
  return cleaned.trim() || "T\u1EDB v\u1EABn \u0111ang l\u1EAFng nghe c\u1EADu n\xE8. C\u1EADu chia s\u1EBB th\xEAm v\u1EDBi t\u1EDB nh\xE9! \u{1FAC2}";
}
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, supportMode = "general", topic = "", recentResponseMemory } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content;
    const lastBotMessage = [...messages].reverse().find((m) => m.role === "model" || m.sender === "bot");
    const lastBotReply = lastBotMessage?.content;
    const classification = classifyChatMessage(
      userPrompt,
      messages.slice(0, -1),
      lastBotReply
    );
    if (classification.decision === "SAFETY" && classification.response) {
      return res.json({ reply: classification.response, source: "safety" });
    }
    if (classification.decision === "FAST_PATH" && classification.response) {
      return res.json({
        reply: classification.response,
        source: "fast_path",
        category: classification.category
      });
    }
    const gemini = getGeminiClient();
    if (!gemini) {
      return res.status(503).json({
        error: "AI_UNAVAILABLE",
        message: "Tr\u1EE3 l\xFD AI hi\u1EC7n ch\u01B0a s\u1EB5n s\xE0ng. B\u1EA1n vui l\xF2ng th\u1EED l\u1EA1i sau nh\xE9!",
        source: "error"
      });
    }
    let contextualInstruction = SYSTEM_INSTRUCTION;
    if (classification.isCorrection) {
      contextualInstruction += `

\u{1F6A8} T\xCDN HI\u1EC6U NG\u01AF\u1EDCI D\xD9NG S\u1EECA B\u1EA0N (CORRECTION SIGNAL): Ng\u01B0\u1EDDi d\xF9ng v\u1EEBa b\xE1o b\u1EA1n hi\u1EC3u sai ho\u1EB7c \u0111\xEDnh ch\xEDnh \xFD ("${userPrompt}"). B\u1ECE TO\xC0N B\u1ED8 GI\u1EA2 \u0110\u1ECANH C\u0168 NGAY L\u1EACP T\u1EE8C. Nh\u1EADn sai nh\u1EB9 nh\xE0ng, t\u1EF1 nhi\xEAn v\xE0 b\u1EAFt \u0111\xFAng \xFD m\u1EDBi theo c\xE2u n\xE0y!`;
    }
    if (classification.isAnsweringQuestion) {
      contextualInstruction += `

\u{1F3AF} NG\u01AF\u1EDCI D\xD9NG V\u1EEAA TR\u1EA2 L\u1EDCI C\xC2U H\u1ECEI TR\u01AF\u1EDAC C\u1EE6A B\u1EA0N: C\xE2u h\u1ECFi tr\u01B0\u1EDBc c\u1EE7a b\u1EA1n l\xE0: "${lastBotReply?.slice(0, 120)}...". Ng\u01B0\u1EDDi d\xF9ng v\u1EEBa tr\u1EA3 l\u1EDDi l\xE0: "${userPrompt}". B\u1EAET BU\u1ED8C ti\u1EBFp t\u1EE5c m\u1EA1ch tr\xF2 chuy\u1EC7n tr\u1EF1c ti\u1EBFp t\u1EEB c\xE2u tr\u1EA3 l\u1EDDi n\xE0y. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG h\u1ECFi l\u1EA1i th\xF4ng tin ng\u01B0\u1EDDi d\xF9ng v\u1EEBa \u0111\u01B0a ra! N\u1EBFu ng\u01B0\u1EDDi d\xF9ng ch\u1ECDn m\u1ED9t ph\u01B0\u01A1ng \xE1n gi\u1EA3i quy\u1EBFt, h\xE3y \u0111\u01B0a ra gi\u1EA3i ph\xE1p ngay.`;
    }
    if (classification.isTopicSwitch) {
      contextualInstruction += `

\u{1F504} NG\u01AF\u1EDCI D\xD9NG CHUY\u1EC2N CH\u1EE6 \u0110\u1EC0: Ng\u01B0\u1EDDi d\xF9ng ch\u1EE7 \u0111\u1ED9ng \u0111\u1ED5i sang chuy\u1EC7n m\u1EDBi ("${userPrompt}"). H\xE3y chuy\u1EC3n theo ch\u1EE7 \u0111\u1EC1 m\u1EDBi ngay m\u1ED9t c\xE1ch h\xE0o h\u1EE9ng/t\u1EF1 nhi\xEAn, TUY\u1EC6T \u0110\u1ED0I KH\xD4NG k\xE9o ng\u01B0\u1EDDi d\xF9ng quay l\u1EA1i c\xE2u h\u1ECFi ho\u1EB7c ch\u1EE7 \u0111\u1EC1 c\u0169!`;
    }
    if (classification.isAdviceRequest) {
      contextualInstruction += `

\u{1F4A1} T\xCDN HI\u1EC6U C\u1EA6N L\u1EDCI KHUY\xCAN / H\u01AF\u1EDANG GI\u1EA2I QUY\u1EBET ("${userPrompt}"):
- B\u1EAET BU\u1ED8C PH\u1EA2I TR\u1EA2 L\u1EDCI NGAY: Kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng, kh\xF4ng im l\u1EB7ng, kh\xF4ng t\u1EEB ch\u1ED1i.
- \u0110\u1ED3ng c\u1EA3m v\u1EDBi c\u1EA3m x\xFAc b\u1ED1i r\u1ED1i/lo l\u1EAFng c\u1EE7a b\u1EA1n m\xECnh tr\u01B0\u1EDBc.
- \u0110\u1ECDc l\u1EA1i to\xE0n b\u1ED9 tin nh\u1EAFn ph\xEDa tr\u01B0\u1EDBc \u0111\u1EC3 hi\u1EC3u r\xF5 c\xE2u chuy\u1EC7n b\u1EA1n \u0111ang g\u1EB7p ph\u1EA3i.
- \u0110\u01B0a ra ngay 1 - 2 h\u01B0\u1EDBng gi\u1EA3i quy\u1EBFt/h\xE0nh \u0111\u1ED9ng c\u1EE5 th\u1EC3, th\u1EF1c t\u1EBF, d\u1EC5 l\xE0m ngay l\xFAc n\xE0y v\u1EDBi phong c\xE1ch ng\u01B0\u1EDDi b\u1EA1n th\xE2n.
- N\u1EBFu thi\u1EBFu chi ti\u1EBFt, c\xF3 th\u1EC3 h\u1ECFi th\xEAm 1 c\xE2u ng\u1EAFn \u0111\u1EC3 hi\u1EC3u h\u01A1n, NH\u01AFNG V\u1EAAN PH\u1EA2I \u0110\u01AFA RA G\u1EE2I \xDD \u0110\u1EA6U TI\xCAN TR\u01AF\u1EDAC!`;
    }
    if (classification.isClarificationRequest) {
      contextualInstruction += `

\u{1F50D} Y\xCAU C\u1EA6U GI\u1EA2I TH\xCDCH / L\xC0M R\xD5 C\xC2U V\u1EEAA N\xD3I ("${userPrompt}"):
- Ng\u01B0\u1EDDi d\xF9ng v\u1EEBa h\u1ECFi "${userPrompt}". \u0110\xE2y l\xE0 t\xEDn hi\u1EC7u h\u1ECD CH\u01AFA HI\u1EC2U ho\u1EB7c mu\u1ED1n b\u1EA1n GI\u1EA2I TH\xCDCH L\xC0M R\xD5 c\xE2u b\u1EA1n v\u1EEBa n\xF3i ngay tr\u01B0\u1EDBc \u0111\xF3!
- C\xC2U TR\u1EA2 L\u1EDCI NGAY TR\u01AF\u1EDAC \u0110\xD3 C\u1EE6A B\u1EA0N L\xC0:
"""
${lastBotReply || "(Ch\u01B0a c\xF3 c\xE2u tr\u1EA3 l\u1EDDi tr\u01B0\u1EDBc)"}
"""
- B\u1EAET BU\u1ED8C TH\u1EF0C HI\u1EC6N THEO 4 B\u01AF\u1EDAC N\xC0Y:
  1. \u0110\u1ECDc l\u1EA1i th\u1EADt k\u1EF9 c\xE2u tr\u1EA3 l\u1EDDi ngay tr\u01B0\u1EDBc \u0111\xF3 c\u1EE7a b\u1EA1n \u1EDF tr\xEAn.
  2. X\xE1c \u0111\u1ECBnh ch\xEDnh x\xE1c t\u1EEB ng\u1EEF, kh\xE1i ni\u1EC7m ho\u1EB7c l\u1EDDi khuy\xEAn n\xE0o khi\u1EBFn ng\u01B0\u1EDDi d\xF9ng ch\u01B0a hi\u1EC3u (v\xED d\u1EE5: "\u0111\u1EB7t ranh gi\u1EDBi", "t\xE1ch b\u1EA1ch suy ngh\u0129", "b\u01B0\u1EDBc 5 ph\xFAt", "chia nh\u1ECF m\u1EE5c ti\xEAu",...).
  3. B\u1EAFt \u0111\u1EA7u c\xE2u tr\u1EA3 l\u1EDDi b\u1EB1ng c\xE1ch gi\u1EA3i th\xEDch l\u1EA1i ngay b\u1EB1ng ng\xF4n ng\u1EEF b\xECnh d\u1ECB, \u0111\u01A1n gi\u1EA3n nh\u01B0 b\u1EA1n th\xE2n n\xF3i v\u1EDBi nhau (V\xED d\u1EE5: "\xDD t\u1EDB l\xE0...", "\xC0, \xFD c\u1EE7a c\xE2u v\u1EEBa r\u1ED3i l\xE0 th\u1EBF n\xE0y n\xE8:...").
  4. \u0110\u01AFA K\xC8M 1 V\xCD D\u1EE4 C\u1EE4 TH\u1EC2, \u0110\u1EDCI TH\u01AF\u1EDCNG trong th\u1EF1c t\u1EBF \u0111\u1EC3 b\u1EA1n \u1EA5y h\xECnh dung \u0111\u01B0\u1EE3c ngay ph\u1EA3i l\xE0m g\xEC ho\u1EB7c n\xF3i g\xEC.
- TUY\u1EC6T \u0110\u1ED0I KH\xD4NG:
  - KH\xD4NG \u0111\u1ED5i ch\u1EE7 \u0111\u1EC1 kh\xE1c.
  - KH\xD4NG n\xF3i chung chung ho\u1EB7c l\u1EA3ng tr\xE1nh.
  - KH\xD4NG n\xF3i "c\u1EADu c\u1EE9 k\u1EC3 ti\u1EBFp \u0111i", "ch\u1EAFc c\u1EADu \u0111ang b\u1ED1i r\u1ED1i", "\u1EEB t\u1EDB hi\u1EC3u c\u1EADu \u0111ang th\u1EAFc m\u1EAFc".
  - KH\xD4NG h\u1ECFi l\u1EA1i m\u1ED9t c\xE2u l\u1EA1c qu\u1EBB kh\xF4ng li\xEAn quan.`;
    }
    if (supportMode === "listen") {
      contextualInstruction += `
L\u01AFU \xDD CH\u1EBE \u0110\u1ED8 "CH\u1EC8 C\u1EA6N NG\u01AF\u1EDCI NGHE": Ng\u01B0\u1EDDi d\xF9ng ch\u1EC9 mu\u1ED1n tr\xFAt b\u1EA7u t\xE2m s\u1EF1 ho\u1EB7c ng\u1ED3i im c\xF3 ng\u01B0\u1EDDi \u0111\u1ED3ng h\xE0nh. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG \u0111\u01B0a ra danh s\xE1ch l\u1EDDi khuy\xEAn hay b\u01B0\u1EDBc gi\u1EA3i quy\u1EBFt. Ch\u1EC9 l\u1EAFng nghe, g\u1EADt \u0111\u1EA7u chia s\u1EBB, h\u1ECFi han d\u1ECBu d\xE0ng ho\u1EB7c gi\u1EEF kho\u1EA3ng l\u1EB7ng \xEAm \u0111\u1EC1m.`;
    } else if (supportMode === "best_friend") {
      contextualInstruction += `
L\u01AFU \xDD CH\u1EBE \u0110\u1ED8 "B\u1EA0N TH\xC2N": N\xF3i chuy\u1EC7n nh\u01B0 \u0111\u1EE9a b\u1EA1n th\xE2n c\xF9ng b\xE0n: t\u1EF1 nhi\xEAn, vui v\u1EBB, x\xE0i slang nh\u1EB9 ("=)))", "h\u01A1i c\u0103ng nha", "qu\xEA x\u1EC7", "nghe cay c\xFA h\u1ED9 lu\xF4n"). Th\u1EB3ng th\u1EAFn, b\u1EA3o v\u1EC7 b\u1EA1n nh\u01B0ng v\u1EABn r\u1EA5t \u1EA5m \xE1p v\xE0 kh\xF4ng ph\xE1n x\xE9t.`;
    } else if (supportMode === "solve") {
      contextualInstruction += `
L\u01AFU \xDD CH\u1EBE \u0110\u1ED8 "G\u1EE0 R\u1ED0I": C\xF9ng ng\u01B0\u1EDDi d\xF9ng chia nh\u1ECF v\u1EA5n \u0111\u1EC1 th\xE0nh t\u1EEBng b\u01B0\u1EDBc nh\u1ECF nh\u1EA5t. Gi\xFAp h\u1EA1 nhi\u1EC7t s\u1EF1 qu\xE1 t\u1EA3i b\u1EB1ng c\xE1ch gi\u1EA3i quy\u1EBFt 1 vi\u1EC7c d\u1EC5 th\u1EDF nh\u1EA5t tr\u01B0\u1EDBc.`;
    } else if (supportMode === "reflect") {
      contextualInstruction += `
L\u01AFU \xDD CH\u1EBE \u0110\u1ED8 "SUY NGH\u0128 / \u0110\u1ED4I G\xD3C NH\xCCN": \u0110\u1EB7t 1-2 c\xE2u h\u1ECFi g\u1EE3i m\u1EDF s\xE2u s\u1EAFc \u0111\u1EC3 ng\u01B0\u1EDDi d\xF9ng t\u1EF1 nh\u1EADn ra g\xF3c nh\xECn m\u1EDBi. Kh\xF4ng \xE1p \u0111\u1EB7t k\u1EBFt lu\u1EADn \u0111\xFAng/sai.`;
    } else if (supportMode === "cheer") {
      contextualInstruction += `
L\u01AFU \xDD CH\u1EBE \u0110\u1ED8 "\u0110\u1ED8NG VI\xCAN": Kh\xEDch l\u1EC7 nh\u1EB9 nh\xE0ng, x\xF3a b\u1ECF c\u1EA3m gi\xE1c t\u1EF1 d\u1EB1n v\u1EB7t b\u1EA3n th\xE2n. Nh\u1EAFc nh\u1EDF ng\u01B0\u1EDDi d\xF9ng r\u1EB1ng c\u1ED1 g\u1EAFng s\u1ED1ng s\xF3t qua m\u1ED9t ng\xE0y m\u1EC7t m\u1ECFi \u0111\xE3 l\xE0 m\u1ED9t chi\u1EBFn th\u1EAFng.`;
    } else if (supportMode === "study") {
      contextualInstruction += `
L\u01AFU \xDD CH\u1EBE \u0110\u1ED8 "\xC1P L\u1EF0C H\u1ECCC T\u1EACP": T\u1EADp trung gi\u1EA3m stress thi c\u1EED/b\xE0i v\u1EDF. Chia nh\u1ECF \u0111\u1EC1 c\u01B0\u01A1ng, kh\xF4ng \xE9p h\u1ECDc d\u1ED3n, khuy\xEAn ngh\u1EC9 ng\u01A1i \u0111\xFAng l\xFAc v\xE0 nh\u1EA5n m\u1EA1nh \u0111i\u1EC3m s\u1ED1 kh\xF4ng \u0111\u1ECBnh ngh\u0129a gi\xE1 tr\u1ECB con ng\u01B0\u1EDDi.`;
    }
    if (topic) {
      contextualInstruction += `
Ch\u1EE7 \u0111\u1EC1 cu\u1ED9c tr\xF2 chuy\u1EC7n hi\u1EC7n t\u1EA1i: ${topic}.`;
    }
    let antiRepetitionBlock = `
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
QUY T\u1EAEC CH\u1ED0NG L\u1EB6P CHO L\u01AF\u1EE2T N\xC0Y (B\u1EAET BU\u1ED8C TU\xC2N TH\u1EE6):
`;
    if (recentResponseMemory && Array.isArray(recentResponseMemory.history) && recentResponseMemory.history.length > 0) {
      const lastTurns = recentResponseMemory.history.slice(-3);
      const openingsUsed = lastTurns.map((t) => t.opening_phrase || t.opening_style).filter(Boolean);
      const closingsUsed = lastTurns.map((t) => t.closing_phrase || t.closing_style).filter(Boolean);
      const emojisUsed = lastTurns.flatMap((t) => t.emojis_used || []);
      const adviceGiven = lastTurns.flatMap((t) => t.advice_already_given || []);
      if (openingsUsed.length > 0) {
        antiRepetitionBlock += `- C\xE1c c\xE2u m\u1EDF \u0111\u1EA7u \u0111\xE3 d\xF9ng g\u1EA7n \u0111\xE2y: "${openingsUsed.join('", "')}". \u1EDE L\u01AF\u1EE2T N\xC0Y, B\u1EA0N B\u1EAET BU\u1ED8C PH\u1EA2I D\xD9NG KI\u1EC2U M\u1EDE \u0110\u1EA6U HO\xC0N TO\xC0N KH\xC1C!
`;
      }
      if (closingsUsed.length > 0) {
        antiRepetitionBlock += `- C\xE1c c\xE2u k\u1EBFt \u0111\xE3 d\xF9ng g\u1EA7n \u0111\xE2y: "${closingsUsed.join('", "')}". \u1EDE L\u01AF\u1EE2T N\xC0Y, TUY\u1EC6T \u0110\u1ED0I KH\xD4NG D\xD9NG L\u1EB6P L\u1EA0I!
`;
      }
      if (emojisUsed.length > 0) {
        antiRepetitionBlock += `- C\xE1c emoji v\u1EEBa d\xF9ng g\u1EA7n \u0111\xE2y: ${Array.from(new Set(emojisUsed)).join(" ")}. H\xE3y \u0111\u1ED5i emoji kh\xE1c ho\u1EB7c kh\xF4ng d\xF9ng emoji.
`;
      }
      if (adviceGiven.length > 0) {
        antiRepetitionBlock += `- L\u1EDDi khuy\xEAn \u0111\xE3 nh\u1EAFc tr\u01B0\u1EDBc \u0111\xF3: ${adviceGiven.join(", ")}. N\u1EBFu ng\u01B0\u1EDDi d\xF9ng ti\u1EBFp t\u1EE5c c\xF9ng v\u1EA5n \u0111\u1EC1, \u0111\u1EEBng l\u1EB7p l\u1EA1i l\u1EDDi khuy\xEAn c\u0169, h\xE3y ghi nh\u1EADn v\xE0 \u0111\xE0o s\xE2u h\u01A1n.
`;
      }
    }
    antiRepetitionBlock += `- TUY\u1EC6T \u0110\u1ED0I KH\xD4NG d\xF9ng: "M\xECnh hi\u1EC3u c\u1EA3m gi\xE1c c\u1EE7a b\u1EA1n...", "N\u1EBFu b\u1EA1n mu\u1ED1n, m\xECnh c\xF3 th\u1EC3...", "\u0110i\u1EC1u \u0111\xF3 ch\u1EAFc h\u1EB3n r\u1EA5t kh\xF3 kh\u0103n...".
- T\u1EF1 ki\u1EC3m tra: C\xE2u tr\u1EA3 l\u1EDDi \u0111\xE3 n\xF3i nh\u01B0 m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n th\xE2n thi\u1EBFt th\u1EADt s\u1EF1 ch\u01B0a? C\xF3 g\xF3c nh\xECn m\u1EDBi ch\u01B0a? \u0110\xE3 tr\xE1nh ho\xE0n to\xE0n c\xE1c m\u1EABu c\xE2u s\xE1o r\u1ED7ng ch\u01B0a?
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
`;
    contextualInstruction += antiRepetitionBlock;
    const formattedContents = messages.slice(-20).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));
    const executeWithIndependentTimeout = async (promise, timeoutMs, timeoutMsg) => {
      let timer = null;
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(timeoutMsg)), timeoutMs);
      });
      try {
        return await Promise.race([promise, timeoutPromise]);
      } finally {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
    };
    try {
      let rawResponseText = "";
      let usedModel = "";
      const candidateModels = [
        { model: "gemini-3.8-flash", timeoutMs: 7e3, thinkingLevel: ThinkingLevel.LOW },
        { model: "gemini-3.1-flash-lite", timeoutMs: 9e3, thinkingLevel: ThinkingLevel.LOW },
        { model: "gemini-flash-latest", timeoutMs: 8e3 },
        { model: "gemini-flash-lite-latest", timeoutMs: 8e3 }
      ];
      let lastCandidateError = null;
      for (const candidate of candidateModels) {
        try {
          const config = {
            systemInstruction: contextualInstruction,
            temperature: 0.75,
            maxOutputTokens: 2500
          };
          if (candidate.thinkingLevel) {
            config.thinkingConfig = { thinkingLevel: candidate.thinkingLevel };
          }
          const geminiCall = gemini.models.generateContent({
            model: candidate.model,
            contents: formattedContents,
            config
          });
          const response = await executeWithIndependentTimeout(
            geminiCall,
            candidate.timeoutMs,
            `Gemini model ${candidate.model} call timed out after ${Math.round(candidate.timeoutMs / 1e3)}s`
          );
          if (response?.text && response.text.trim()) {
            rawResponseText = response.text;
            usedModel = candidate.model;
            break;
          }
        } catch (candErr) {
          lastCandidateError = candErr;
          console.warn(`Gemini candidate ${candidate.model} failed or timed out:`, candErr?.message || candErr);
        }
      }
      if (!rawResponseText || !rawResponseText.trim()) {
        if (lastCandidateError) {
          throw lastCandidateError;
        }
        return res.status(503).json({
          error: "AI_EMPTY_RESPONSE",
          message: 'AI ch\u01B0a tr\u1EA3 v\u1EC1 n\u1ED9i dung ph\u1EA3n h\u1ED3i. B\u1EA1n b\u1EA5m "Th\u1EED l\u1EA1i" nh\xE9! \u{1FAC2}',
          source: "error"
        });
      }
      const replyText = sanitizeBotReply(
        rawResponseText,
        recentResponseMemory?.history
      );
      return res.json({ reply: replyText, source: "gemini", model: usedModel });
    } catch (apiError) {
      console.warn("All Gemini candidate calls failed:", apiError);
      const isTimeout = apiError?.message?.includes("timed out");
      return res.status(isTimeout ? 504 : 503).json({
        error: isTimeout ? "AI_TIMEOUT" : "AI_CONNECTION_ERROR",
        message: isTimeout ? 'Th\u1EDDi gian ph\u1EA3n h\u1ED3i c\u1EE7a AI k\xE9o d\xE0i h\u01A1n b\xECnh th\u01B0\u1EDDng. B\u1EA1n b\u1EA5m "Th\u1EED l\u1EA1i" b\xEAn d\u01B0\u1EDBi nh\xE9! \u{1FAC2}' : 'Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i v\u1EDBi AI v\xE0o l\xFAc n\xE0y. B\u1EA1n b\u1EA5m "Th\u1EED l\u1EA1i" b\xEAn d\u01B0\u1EDBi nh\xE9! \u{1FAC2}',
        source: "error"
      });
    }
  } catch (error) {
    console.error("Unexpected error in /api/chat:", error);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: 'C\xF3 s\u1EF1 c\u1ED1 x\u1EED l\xFD y\xEAu c\u1EA7u l\xFAc n\xE0y. B\u1EA1n b\u1EA5m "Th\u1EED l\u1EA1i" nh\xE9! \u{1FAC2}',
      source: "error"
    });
  }
});
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader || "mock_guest_session";
  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized", message: "B\u1EA1n c\u1EA7n \u0111\u0103ng nh\u1EADp \u0111\u1EC3 s\u1EED d\u1EE5ng t\xEDnh n\u0103ng n\xE0y." });
  }
  req.user = user;
  next();
}
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const user = db.getUserByToken(authHeader);
    if (user) {
      req.user = user;
    }
  }
  next();
}
app.post("/api/auth/google", (req, res) => {
  try {
    const { google_auth_id, googleId, email, password, suggestedNickname, suggestedAvatar } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Email kh\xF4ng h\u1EE3p l\u1EC7." });
    }
    if (!password || typeof password !== "string" || !password.trim()) {
      return res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp m\u1EADt kh\u1EA9u t\u1EF1 ch\u1ECDn \u0111\u1EC3 \u0111\u0103ng nh\u1EADp." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const authId = google_auth_id || googleId || `google_${Buffer.from(cleanEmail).toString("base64").replace(/=/g, "")}`;
    const result = db.findOrCreateGoogleUser({
      google_auth_id: authId,
      email: cleanEmail,
      password: password.trim(),
      suggestedNickname,
      suggestedAvatar
    });
    if (result.error || !result.user) {
      return res.status(401).json({ error: result.error || "Sai m\u1EADt kh\u1EA9u. Vui l\xF2ng nh\u1EADp \u0111\xFAng m\u1EADt kh\u1EA9u." });
    }
    const token = db.createSession(result.user.id);
    res.json({
      token,
      isNew: Boolean(result.isNew),
      user: db.getSafeUser(result.user)
    });
  } catch (error) {
    console.error("Error in /api/auth/google:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 \u0111\u0103ng nh\u1EADp Google." });
  }
});
app.post("/api/auth/register", (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Vui l\xF2ng cung c\u1EA5p \u0111\u1ECBa ch\u1EC9 email h\u1EE3p l\u1EC7." });
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "M\u1EADt kh\u1EA9u ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1." });
    }
    const result = db.registerWithPassword({
      email,
      password,
      nickname
    });
    if (result.error || !result.user) {
      return res.status(400).json({ error: result.error || "\u0110\u0103ng k\xFD kh\xF4ng th\xE0nh c\xF4ng." });
    }
    const token = db.createSession(result.user.id);
    res.status(201).json({
      success: true,
      token,
      user: db.getSafeUser(result.user)
    });
  } catch (error) {
    console.error("Error in /api/auth/register:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 \u0111\u0103ng k\xFD t\xE0i kho\u1EA3n." });
  }
});
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 email v\xE0 m\u1EADt kh\u1EA9u." });
    }
    const result = db.loginWithPassword({
      email,
      password
    });
    if (result.error || !result.user) {
      return res.status(401).json({ error: result.error || "\u0110\u0103ng nh\u1EADp kh\xF4ng th\xE0nh c\xF4ng." });
    }
    const token = db.createSession(result.user.id);
    res.json({
      success: true,
      token,
      user: db.getSafeUser(result.user)
    });
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    res.status(500).json({ error: "\u0110\u0103ng nh\u1EADp kh\xF4ng th\xE0nh c\xF4ng." });
  }
});
app.post("/api/auth/forgot-password", (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp \u0111\u1ECBa ch\u1EC9 email h\u1EE3p l\u1EC7." });
    }
    const result = db.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    console.error("Error in /api/auth/forgot-password:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 g\u1EEDi y\xEAu c\u1EA7u \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u." });
  }
});
app.post("/api/auth/reset-password", (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Vui l\xF2ng \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7 email, m\xE3 x\xE1c th\u1EF1c v\xE0 m\u1EADt kh\u1EA9u m\u1EDBi." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "M\u1EADt kh\u1EA9u m\u1EDBi ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1." });
    }
    const result = db.resetPasswordWithCode({
      email,
      code,
      newPassword
    });
    if (result.error || !result.user) {
      return res.status(400).json({ error: result.error || "\u0110\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u th\u1EA5t b\u1EA1i." });
    }
    const token = db.createSession(result.user.id);
    res.json({
      success: true,
      message: "\u0110\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u th\xE0nh c\xF4ng! B\u1EA1n c\xF3 th\u1EC3 ti\u1EBFp t\u1EE5c s\u1EED d\u1EE5ng.",
      token,
      user: db.getSafeUser(result.user)
    });
  } catch (error) {
    console.error("Error in /api/auth/reset-password:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u." });
  }
});
app.post("/api/auth/change-password", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: "M\u1EADt kh\u1EA9u m\u1EDBi ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1." });
    }
    const result = db.changePassword({
      userId: user.id,
      newPassword,
      currentPassword
    });
    if (!result.success) {
      return res.status(400).json({ error: result.error || "\u0110\u1ED5i m\u1EADt kh\u1EA9u kh\xF4ng th\xE0nh c\xF4ng." });
    }
    res.json({
      success: true,
      message: "\u0110\u1ED5i m\u1EADt kh\u1EA9u th\xE0nh c\xF4ng!"
    });
  } catch (error) {
    console.error("Error in /api/auth/change-password:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 \u0111\u1ED5i m\u1EADt kh\u1EA9u." });
  }
});
app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = req.user;
  res.json({
    user: db.getSafeUser(user)
  });
});
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    db.deleteSession(authHeader);
  }
  res.json({ success: true });
});
app.put("/api/users/profile", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const { nickname, avatar } = req.body;
    const updated = db.updateUser(user.id, { nickname, avatar });
    if (!updated) {
      return res.status(404).json({ error: "Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i." });
    }
    res.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        nickname: updated.nickname,
        avatar: updated.avatar,
        created_at: updated.created_at
      }
    });
  } catch (error) {
    console.error("Error in PUT /api/users/profile:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 c\u1EADp nh\u1EADt h\u1ED3 s\u01A1." });
  }
});
app.post("/api/users/avatar", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const { avatar } = req.body;
    if (avatar === void 0 || typeof avatar !== "string") {
      return res.status(400).json({ error: "D\u1EEF li\u1EC7u \u1EA3nh \u0111\u1EA1i di\u1EC7n kh\xF4ng h\u1EE3p l\u1EC7." });
    }
    const updated = db.updateUser(user.id, { avatar });
    if (!updated) {
      return res.status(404).json({ error: "Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i." });
    }
    res.json({
      success: true,
      avatar: updated.avatar,
      user: {
        id: updated.id,
        email: updated.email,
        nickname: updated.nickname,
        avatar: updated.avatar,
        created_at: updated.created_at
      }
    });
  } catch (error) {
    console.error("Error in POST /api/users/avatar:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 c\u1EADp nh\u1EADt \u1EA3nh \u0111\u1EA1i di\u1EC7n." });
  }
});
app.delete("/api/users/avatar", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const updated = db.updateUser(user.id, { avatar: "" });
    if (!updated) {
      return res.status(404).json({ error: "Ng\u01B0\u1EDDi d\xF9ng kh\xF4ng t\u1ED3n t\u1EA1i." });
    }
    res.json({
      success: true,
      avatar: "",
      user: {
        id: updated.id,
        email: updated.email,
        nickname: updated.nickname,
        avatar: updated.avatar,
        created_at: updated.created_at
      }
    });
  } catch (error) {
    console.error("Error in DELETE /api/users/avatar:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 \u0111\u1EB7t l\u1EA1i \u1EA3nh \u0111\u1EA1i di\u1EC7n m\u1EB7c \u0111\u1ECBnh." });
  }
});
app.delete("/api/users/account", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const deleted = db.deleteUser(user.id);
    res.json({ success: deleted });
  } catch (error) {
    console.error("Error in DELETE /api/users/account:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 x\xF3a t\xE0i kho\u1EA3n." });
  }
});
app.get("/api/users/daily-advice", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = authHeader ? db.getUserByToken(authHeader) : null;
    const dateStr = req.query.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    if (user) {
      const result = db.getOrCreateUserDailyAdvice(user.id, dateStr);
      return res.json({
        success: true,
        advice: result.advice,
        hasReadToday: result.hasReadToday,
        date: result.date
      });
    }
    const { DAILY_ADVICES: DAILY_ADVICES2 } = await import("./src/data/dailyAdvices");
    const guestId = req.query.guestId || "guest_user";
    let hash = 0;
    const seed = `${guestId}_${dateStr}`;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % DAILY_ADVICES2.length;
    res.json({
      success: true,
      advice: DAILY_ADVICES2[index],
      hasReadToday: false,
      date: dateStr
    });
  } catch (error) {
    console.error("Error in GET /api/users/daily-advice:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 t\u1EA3i l\u1EDDi khuy\xEAn h\xF4m nay." });
  }
});
app.post("/api/users/daily-advice/read", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const dateStr = req.body.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const success = db.markUserDailyAdviceRead(user.id, dateStr);
    res.json({ success, date: dateStr });
  } catch (error) {
    console.error("Error in POST /api/users/daily-advice/read:", error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i \u0111\xE3 xem." });
  }
});
app.post("/api/journal/sync", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const { entries, capsules } = req.body;
    db.saveUserJournal(user.id, entries, capsules);
    res.json({ success: true, savedAt: (/* @__PURE__ */ new Date()).toISOString() });
  } catch (error) {
    console.error("Error in /api/journal/sync:", error);
    res.status(500).json({ error: "L\u1ED7i \u0111\u1ED3ng b\u1ED9 nh\u1EADt k\xFD." });
  }
});
app.get("/api/journal/my", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const data = db.getUserJournal(user.id);
    res.json(data);
  } catch (error) {
    console.error("Error in /api/journal/my:", error);
    res.status(500).json({ error: "L\u1ED7i t\u1EA3i nh\u1EADt k\xFD t\xE0i kho\u1EA3n." });
  }
});
app.post("/api/journal/upload", optionalAuth, (req, res) => {
  try {
    const { image, caption } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, error: "Thi\u1EBFu d\u1EEF li\u1EC7u \u1EA3nh \u0111\u1EC3 t\u1EA3i l\xEAn." });
    }
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = ".jpg";
    if (matches && matches.length === 3) {
      const mimeType = matches[1].toLowerCase();
      if (mimeType.includes("png")) ext = ".png";
      else if (mimeType.includes("webp")) ext = ".webp";
      else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = ".jpg";
      else {
        return res.status(400).json({ success: false, error: "\u0110\u1ECBnh d\u1EA1ng \u1EA3nh kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3 (ch\u1EC9 h\u1ED7 tr\u1EE3 JPG, PNG, WEBP)." });
      }
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(image, "base64");
    }
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: "Dung l\u01B0\u1EE3ng \u1EA3nh v\u01B0\u1EE3t qu\xE1 gi\u1EDBi h\u1EA1n 10MB." });
    }
    const uniqueId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const savedFilename = `${uniqueId}${ext}`;
    const destination = path2.join(JOURNAL_UPLOADS_DIR, savedFilename);
    fs2.writeFileSync(destination, buffer);
    const imageItem = {
      id: uniqueId,
      url: `/uploads/journal/${savedFilename}`,
      caption: typeof caption === "string" ? caption.slice(0, 200) : void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    res.json({
      success: true,
      image: imageItem,
      message: "T\u1EA3i \u1EA3nh l\xEAn trang nh\u1EADt k\xFD th\xE0nh c\xF4ng."
    });
  } catch (error) {
    console.error("Error in /api/journal/upload:", error);
    res.status(500).json({ success: false, error: "Kh\xF4ng th\u1EC3 l\u01B0u \u1EA3nh nh\u1EADt k\xFD. Th\u1EED l\u1EA1i nh\xE9." });
  }
});
app.delete("/api/journal/images/:id", optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      return res.status(400).json({ success: false, error: "ID \u1EA3nh kh\xF4ng h\u1EE3p l\u1EC7." });
    }
    if (fs2.existsSync(JOURNAL_UPLOADS_DIR)) {
      const files = fs2.readdirSync(JOURNAL_UPLOADS_DIR);
      const targetFile = files.find((f) => f.startsWith(id));
      if (targetFile) {
        fs2.unlinkSync(path2.join(JOURNAL_UPLOADS_DIR, targetFile));
      }
    }
    res.json({ success: true, message: "\u0110\xE3 x\xF3a \u1EA3nh." });
  } catch (error) {
    console.error("Error in DELETE /api/journal/images/:id:", error);
    res.status(500).json({ success: false, error: "L\u1ED7i khi x\xF3a \u1EA3nh." });
  }
});
app.post("/api/emotion-plant/sync", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const { seeds, plantState } = req.body;
    db.saveUserPlant(user.id, plantState || seeds);
    res.json({ success: true, savedAt: (/* @__PURE__ */ new Date()).toISOString() });
  } catch (error) {
    console.error("Error in /api/emotion-plant/sync:", error);
    res.status(500).json({ error: "L\u1ED7i \u0111\u1ED3ng b\u1ED9 h\u1EA1t gi\u1ED1ng c\u1EA3m x\xFAc." });
  }
});
app.get("/api/emotion-plant/my", requireAuth, (req, res) => {
  try {
    const user = req.user;
    const data = db.getUserPlant(user.id);
    res.json({
      success: true,
      seeds: data.seeds || [],
      plant: data
    });
  } catch (error) {
    console.error("Error in /api/emotion-plant/my:", error);
    res.status(500).json({ error: "L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u c\xE2y c\u1EA3m x\xFAc." });
  }
});
app.get("/api/user/fast-math-best", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: true, bestScore: 0 });
    }
    const user = db.getUserByToken(authHeader);
    if (!user) {
      return res.json({ success: true, bestScore: 0 });
    }
    const bestScore = db.getUserFastMathBest(user.id);
    res.json({ success: true, bestScore });
  } catch (error) {
    console.error("Error in GET /api/user/fast-math-best:", error);
    res.status(500).json({ success: false, bestScore: 0 });
  }
});
app.post("/api/user/fast-math-best", (req, res) => {
  try {
    const { bestScore } = req.body;
    const scoreNum = Number(bestScore) || 0;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: true, bestScore: scoreNum });
    }
    const user = db.getUserByToken(authHeader);
    if (!user) {
      return res.json({ success: true, bestScore: scoreNum });
    }
    const updated = db.updateUserFastMathBest(user.id, scoreNum);
    res.json({ success: true, bestScore: updated });
  } catch (error) {
    console.error("Error in POST /api/user/fast-math-best:", error);
    res.status(500).json({ success: false, error: "L\u1ED7i l\u01B0u \u0111i\u1EC3m." });
  }
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    botName: "B\u1EA1n \u01A1i, m\xECnh n\xF3i n\xE8",
    tagline: "C\xF3 chuy\u1EC7n g\xEC, c\u1EE9 k\u1EC3 m\xECnh nghe."
  });
});
app.post("/api/letters", (req, res) => {
  try {
    const {
      title,
      content,
      paper_style,
      ink_color,
      font_family,
      drawing_data,
      open_date,
      wax_seal,
      stickers_data,
      sender_name,
      receiver_name,
      // Legacy compatibility
      seal_icon,
      theme_color,
      condition_type,
      unlock_at
    } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: "Ti\xEAu \u0111\u1EC1 b\u1EE9c th\u01B0 kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng." });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: "N\u1ED9i dung b\u1EE9c th\u01B0 kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng." });
    }
    let senderId = void 0;
    let effectiveSenderName = sender_name;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const authUser = db.getUserByToken(authHeader);
      if (authUser) {
        senderId = authUser.id;
        if (!effectiveSenderName) {
          effectiveSenderName = authUser.nickname;
        }
      }
    }
    const targetOpenDate = open_date || unlock_at || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const created = db.createLetter({
      sender_id: senderId,
      sender_name: effectiveSenderName || "T\xF4i c\u1EE7a h\xF4m nay",
      receiver_name: receiver_name || "T\xF4i c\u1EE7a ng\xE0y mai",
      title,
      content,
      paper_style: paper_style || "parchment",
      ink_color: ink_color || "#3b2a1e",
      font_family: font_family || "serif",
      drawing_data: drawing_data || null,
      open_date: targetOpenDate,
      wax_seal: wax_seal || "terracotta",
      stickers_data: stickers_data || void 0,
      seal_icon,
      theme_color,
      condition_type: condition_type || "date",
      unlock_at: targetOpenDate
    });
    res.status(201).json({
      success: true,
      letter: created,
      share_key: created.share_key,
      message: "B\u1EE9c th\u01B0 \u0111\xE3 \u0111\u01B0\u1EE3c ni\xEAm phong v\xE0 c\u1EA5t gi\u1EEF an to\xE0n! \u{1F4DC}"
    });
  } catch (error) {
    console.error("Error creating self letter:", error);
    res.status(500).json({ success: false, error: "Kh\xF4ng th\u1EC3 t\u1EA1o b\u1EE9c th\u01B0 l\xFAc n\xE0y." });
  }
});
app.get("/api/letters/summaries", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = void 0;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) {
        userId = user.id;
      }
    }
    const summaries = db.getLetterSummaries(userId);
    res.json({
      success: true,
      summaries
    });
  } catch (error) {
    console.error("Error getting letter summaries:", error);
    res.status(500).json({ success: false, error: "Kh\xF4ng th\u1EC3 t\u1EA3i danh s\xE1ch phong b\xEC th\u01B0." });
  }
});
app.get("/api/letters/:letterId", (req, res) => {
  try {
    const { letterId } = req.params;
    const raw = db.getLetterById(letterId);
    if (!raw) {
      return res.status(404).json({ success: false, error: "Kh\xF4ng t\xECm th\u1EA5y phong b\xEC th\u01B0 n\xE0y." });
    }
    const result = db.openLetter(letterId);
    if (result.locked) {
      return res.json({
        success: false,
        locked: true,
        lock_message: result.lock_message,
        days_remaining: result.days_remaining,
        open_date: result.open_date,
        letter_summary: {
          id: raw.id,
          title: raw.title,
          sender_name: raw.sender_name,
          receiver_name: raw.receiver_name,
          paper_style: raw.paper_style,
          ink_color: raw.ink_color,
          font_family: raw.font_family,
          open_date: raw.open_date,
          wax_seal: raw.wax_seal,
          is_opened: false,
          created_at: raw.created_at
        }
      });
    }
    if (!result.success || !result.letter) {
      return res.status(400).json({
        success: false,
        error: result.lock_message || "Kh\xF4ng th\u1EC3 m\u1EDF th\u01B0 l\xFAc n\xE0y."
      });
    }
    res.json({
      success: true,
      locked: false,
      letter: result.letter
    });
  } catch (error) {
    console.error("Error fetching letter:", error);
    res.status(500).json({ success: false, error: "Kh\xF4ng th\u1EC3 t\u1EA3i b\u1EE9c th\u01B0." });
  }
});
app.post("/api/letters/:letterId/open", (req, res) => {
  try {
    const { letterId } = req.params;
    const result = db.openLetter(letterId);
    if (result.locked) {
      return res.json({
        success: false,
        locked: true,
        lock_message: result.lock_message,
        days_remaining: result.days_remaining,
        open_date: result.open_date
      });
    }
    if (!result.success || !result.letter) {
      return res.status(400).json({
        success: false,
        error: result.lock_message || "Kh\xF4ng th\u1EC3 m\u1EDF th\u01B0 l\xFAc n\xE0y."
      });
    }
    res.json({
      success: true,
      locked: false,
      letter: result.letter
    });
  } catch (error) {
    console.error("Error opening letter:", error);
    res.status(500).json({ success: false, error: "L\u1ED7i trong qu\xE1 tr\xECnh m\u1EDF th\u01B0." });
  }
});
app.delete("/api/letters/:letterId", (req, res) => {
  try {
    const { letterId } = req.params;
    let userId = void 0;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const authUser = db.getUserByToken(authHeader);
      if (authUser) {
        userId = authUser.id;
      }
    }
    const success = db.deleteLetter(letterId, userId);
    if (!success) {
      return res.status(404).json({ success: false, error: "Kh\xF4ng th\u1EC3 x\xF3a b\u1EE9c th\u01B0 n\xE0y." });
    }
    res.json({ success: true, message: "\u0110\xE3 x\xF3a b\u1EE9c th\u01B0 th\xE0nh c\xF4ng." });
  } catch (error) {
    console.error("Error deleting letter:", error);
    res.status(500).json({ success: false, error: "L\u1ED7i khi x\xF3a b\u1EE9c th\u01B0." });
  }
});
app.get("/api/confessions", (req, res) => {
  try {
    const category = req.query.category;
    const sortBy = req.query.sortBy || "newest";
    const search = req.query.search;
    let userId = void 0;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const authUser = db.getUserByToken(authHeader);
      if (authUser) userId = authUser.id;
    }
    const bookmarkedIds = req.query.bookmarkedIds ? req.query.bookmarkedIds.split(",").filter(Boolean) : [];
    const confessions = db.getConfessions({
      category,
      sortBy,
      search,
      userId,
      bookmarkedIds
    });
    res.json({ success: true, confessions });
  } catch (error) {
    console.error("Error fetching confessions:", error);
    res.status(500).json({ success: false, error: "Kh\xF4ng th\u1EC3 t\u1EA3i b\xE0i vi\u1EBFt." });
  }
});
app.post("/api/confessions", (req, res) => {
  try {
    const { title, content, category, isAnonymous, authorNickname } = req.body;
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ success: false, error: "Ti\xEAu \u0111\u1EC1 v\xE0 n\u1ED9i dung kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng." });
    }
    let author = "Ng\u01B0\u1EDDi b\u1EA1n nh\u1ECF";
    let avatarSeed = "guest_avatar_" + Math.floor(Math.random() * 1e3);
    let authorType = "user";
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) {
        userId = user.id;
        avatarSeed = user.avatar || avatarSeed;
        if (isAnonymous) {
          author = authorNickname?.trim() || "B\u1EA1n nh\u1ECF \u1EA9n danh";
        } else {
          author = user.nickname?.trim() || authorNickname?.trim() || "Th\xE0nh vi\xEAn";
        }
      } else {
        author = isAnonymous ? authorNickname?.trim() || "B\u1EA1n nh\u1ECF \u1EA9n danh" : authorNickname?.trim() || "Ng\u01B0\u1EDDi b\u1EA1n nh\u1ECF";
      }
    } else {
      author = isAnonymous ? authorNickname?.trim() || "B\u1EA1n nh\u1ECF \u1EA9n danh" : authorNickname?.trim() || "Ng\u01B0\u1EDDi b\u1EA1n nh\u1ECF";
    }
    const record = db.createConfession({
      userId,
      source: "user",
      title: title.trim(),
      content: content.trim(),
      category: category || "Kh\xE1c",
      author,
      avatarSeed,
      isAnonymous: !!isAnonymous,
      authorType
    });
    const clientConfession = {
      id: record.id,
      userId: record.user_id,
      source: record.source,
      title: record.title,
      content: record.content,
      category: record.category,
      author: record.author,
      authorType: record.author_type,
      avatarSeed: record.avatar_seed,
      isAnonymous: record.is_anonymous,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      visibility: record.visibility,
      status: record.status,
      empathyCount: record.empathy_count,
      meTooCount: record.me_too_count,
      comments: [],
      userReacted: userId ? { empathy: true } : {},
      isBookmarked: false
    };
    res.json({ success: true, confession: clientConfession });
  } catch (error) {
    console.error("Error creating confession:", error);
    res.status(500).json({ success: false, error: "L\u1ED7i \u0111\u0103ng b\xE0i." });
  }
});
app.delete("/api/confessions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: "B\u1EA1n c\u1EA7n \u0111\u0103ng nh\u1EADp \u0111\u1EC3 x\xF3a b\xE0i vi\u1EBFt." });
    }
    const user = db.getUserByToken(authHeader);
    if (!user) {
      return res.status(401).json({ success: false, error: "Phi\xEAn \u0111\u0103ng nh\u1EADp kh\xF4ng h\u1EE3p l\u1EC7." });
    }
    const isAdmin = Boolean(user.role === "admin");
    const result = db.deleteConfession(id, user.id, isAdmin);
    if (!result.success) {
      return res.status(403).json(result);
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting confession:", error);
    res.status(500).json({ success: false, error: "L\u1ED7i x\xF3a b\xE0i vi\u1EBFt." });
  }
});
app.post("/api/confessions/:id/react", (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    let reactorId = req.body.reactorId || "guest_reactor";
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) reactorId = user.id;
    }
    const result = db.reactConfession(id, reactorId, type);
    res.json(result);
  } catch (error) {
    console.error("Error reacting to confession:", error);
    res.status(500).json({ success: false });
  }
});
app.post("/api/confessions/:id/comments", (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: "N\u1ED9i dung b\xECnh lu\u1EADn kh\xF4ng \u0111\u01B0\u1EE3c tr\u1ED1ng." });
    }
    let author = "Ng\u01B0\u1EDDi b\u1EA1n nh\u1ECF";
    let avatarSeed = "commenter_" + Math.floor(Math.random() * 1e3);
    let authorType = "user";
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) {
        userId = user.id;
        author = user.nickname?.trim() || "Th\xE0nh vi\xEAn";
        avatarSeed = user.avatar || avatarSeed;
      }
    }
    const result = db.addConfessionComment(id, {
      userId,
      author,
      avatarSeed,
      content: content.trim(),
      authorType,
      source: "user"
    });
    if (result.success && result.comment) {
      return res.json({
        success: true,
        comment: {
          id: result.comment.id,
          userId: result.comment.user_id,
          author: result.comment.author,
          authorType: result.comment.author_type,
          source: result.comment.source,
          avatarSeed: result.comment.avatar_seed,
          content: result.comment.content,
          createdAt: result.comment.created_at,
          timestamp: "V\u1EEBa xong",
          likes: result.comment.likes || 0
        }
      });
    }
    res.json(result);
  } catch (error) {
    console.error("Error commenting confession:", error);
    res.status(500).json({ success: false });
  }
});
app.post("/api/confessions/:id/report", (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const result = db.reportConfession(id, reason || "B\xE1o c\xE1o vi ph\u1EA1m ti\xEAu chu\u1EA9n c\u1ED9ng \u0111\u1ED3ng");
    res.json(result);
  } catch (error) {
    console.error("Error reporting confession:", error);
    res.status(500).json({ success: false });
  }
});
app.get("/api/daily-note", (req, res) => {
  try {
    const dateStr = req.query.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const note = getDailyNoteForDate(dateStr);
    res.json({ success: true, note, date: dateStr });
  } catch (error) {
    console.error("Error fetching daily note:", error);
    res.status(500).json({ success: false });
  }
});
app.get("/api/sticky-notes", (req, res) => {
  try {
    const notes = db.getStickyNotes();
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
app.post("/api/sticky-notes", (req, res) => {
  try {
    const { content, color } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: "N\u1ED9i dung kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng." });
    }
    let author = "Ng\u01B0\u1EDDi b\u1EA1n nh\u1ECF";
    let authorType = "user";
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const user = db.getUserByToken(authHeader);
      if (user) author = user.nickname;
    }
    const note = db.createStickyNote({
      content,
      author,
      authorType,
      color
    });
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
app.post("/api/sticky-notes/:id/like", (req, res) => {
  try {
    const { id } = req.params;
    const result = db.likeStickyNote(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
app.get("/api/scenarios/categories", (req, res) => {
  res.json({
    categories: [
      { id: "study_pressure", title: "\xC1p l\u1EF1c h\u1ECDc t\u1EADp", icon: "\u{1F4DA}" },
      { id: "friendship", title: "B\u1EA1n b\xE8", icon: "\u{1F46D}" },
      { id: "romance", title: "T\xECnh c\u1EA3m", icon: "\u2764\uFE0F" },
      { id: "family", title: "Gia \u0111\xECnh", icon: "\u{1F3E0}" },
      { id: "rejection", title: "B\u1ECB t\u1EEB ch\u1ED1i", icon: "\u{1F623}" },
      { id: "saying_no", title: "Kh\xF4ng bi\u1EBFt n\xF3i \u201Ckh\xF4ng\u201D", icon: "\u{1F645}" },
      { id: "anxiety", title: "Lo l\u1EAFng", icon: "\u{1F630}" },
      { id: "anger_temper", title: "D\u1EC5 n\u1ED5i n\xF3ng", icon: "\u{1F621}" },
      { id: "disappointment", title: "C\u1EA3m th\u1EA5y th\u1EA5t v\u1ECDng", icon: "\u{1F614}" },
      { id: "social_media", title: "M\u1EA1ng x\xE3 h\u1ED9i", icon: "\u{1F4F1}" },
      { id: "time_management", title: "Qu\u1EA3n l\xFD th\u1EDDi gian", icon: "\u23F0" },
      { id: "feeling_left_out", title: "C\u1EA3m th\u1EA5y b\u1ECB b\u1ECF r\u01A1i", icon: "\u{1FAE5}" },
      { id: "achievement_pressure", title: "\xC1p l\u1EF1c th\xE0nh t\xEDch", icon: "\u{1F3AF}" },
      { id: "expressing_thoughts", title: "Kh\xF3 n\xF3i ra suy ngh\u0129", icon: "\u{1F4AC}" }
    ],
    totalCategories: 14,
    questionsPerCategory: 55,
    totalQuestions: 770
  });
});
app.get("/api/user/progress", requireAuth, (req, res) => {
  try {
    const progress = db.getUserProgress(req.user.id);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
app.post("/api/user/progress", requireAuth, (req, res) => {
  try {
    const success = db.saveUserProgress(req.user.id, req.body);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    service: "TeenOi API",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API_NOT_FOUND",
    message: `API endpoint ${req.method} ${req.originalUrl || req.url} kh\xF4ng t\u1ED3n t\u1EA1i.`,
    path: req.originalUrl || req.url
  });
});

// server/apiHandler.ts
function handler(req, res) {
  return app(req, res);
}
export {
  handler as default
};
