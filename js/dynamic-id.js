function replaceDynamicIds(template, uniqueId) {
    return template.replace(/{{id}}/g, uniqueId);
}
