"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCompanyId = resolveCompanyId;
const company_constants_1 = require("../../company/company.constants");
function resolveCompanyId(companyId) {
    return companyId ?? company_constants_1.DEFAULT_COMPANY_ID;
}
//# sourceMappingURL=company-scope.js.map