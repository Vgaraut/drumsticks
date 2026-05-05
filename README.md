# DrumForge Agent Pack

Рабочее название продукта: **DrumForge**.

Это пакет документов для агентной разработки standalone web-сервиса для барабанщиков:

- собрать кастомную барабанную установку;
- набить барабанную партию в grid editor;
- сразу послушать партию в браузере;
- экспортировать MIDI / printable PDF / JSON;
- применять AI-правки к выделенному фрагменту, а не заменять автора.

## Как использовать

1. Создать новый репозиторий.
2. Скопировать все файлы из этого пакета в корень репозитория.
3. Дать агенту сначала `tasks/000_repo_scaffold.md`.
4. После завершения каждого задания прогонять checklist из `code_review.md`.
5. Не давать агенту задачу “сделай всё приложение целиком”. Идти строго по milestones.

## Рекомендуемый порядок задач

1. `tasks/000_repo_scaffold.md`
2. `tasks/001_core_domain_model.md`
3. `tasks/002_basic_grid_editor.md`
4. `tasks/003_kit_builder.md`
5. `tasks/004_playback_engine.md`
6. `tasks/005_midi_export.md`
7. `tasks/006_project_api.md`
8. `tasks/007_ai_patch_contract.md`
9. `tasks/008_mock_ai_assist.md`
10. `tasks/009_pdf_export_basic.md`
11. `tasks/010_persistence_postgres.md`
12. `tasks/011_polish_and_quality_gate.md`

## Core stance

Не строим DAW. Не строим VST. Не строим “AI composer”. Не делаем каталог брендовых тарелок в MVP.

Строим быстрый и приятный **drum-writing workspace**.

## Development

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm dev` starts:

- web: http://localhost:4310
- API: http://localhost:4311

The API exposes `GET /health` as the initial scaffold endpoint.
