-- ============================================
-- AUDIT TABLES FOR RBAC COMPLIANCE
-- RN05: Comprehensive audit logging system
-- ============================================

-- Main audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id_audit SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    action VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    method VARCHAR(10) NOT NULL,
    path VARCHAR(500) NOT NULL,
    status_code INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_body JSONB,
    response_data JSONB,
    changes JSONB,
    error_message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES funcionarios(id_funcionarios) ON DELETE SET NULL
);

-- Financial audit logs (specialized for payment operations)
CREATE TABLE IF NOT EXISTS financial_audit_logs (
    id_financial_audit SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2),
    payment_id INTEGER,
    student_id INTEGER,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_financial_user FOREIGN KEY (user_id) REFERENCES funcionarios(id_funcionarios) ON DELETE CASCADE,
    CONSTRAINT fk_financial_payment FOREIGN KEY (payment_id) REFERENCES pagamentos(id_pagamento) ON DELETE SET NULL,
    CONSTRAINT fk_financial_student FOREIGN KEY (student_id) REFERENCES alunos(id_alunos) ON DELETE SET NULL
);

-- Grade audit logs (track all grade modifications)
CREATE TABLE IF NOT EXISTS grade_audit_logs (
    id_grade_audit SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    grade_id INTEGER,
    student_id INTEGER,
    subject_id INTEGER,
    old_value DECIMAL(5, 2),
    new_value DECIMAL(5, 2),
    changes JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grade_audit_user FOREIGN KEY (user_id) REFERENCES funcionarios(id_funcionarios) ON DELETE CASCADE,
    CONSTRAINT fk_grade_audit_grade FOREIGN KEY (grade_id) REFERENCES notas(id_nota) ON DELETE SET NULL,
    CONSTRAINT fk_grade_audit_student FOREIGN KEY (student_id) REFERENCES alunos(id_alunos) ON DELETE SET NULL,
    CONSTRAINT fk_grade_audit_subject FOREIGN KEY (subject_id) REFERENCES disciplinas(id_disciplina) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_financial_audit_user_id ON financial_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_audit_timestamp ON financial_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_financial_audit_payment_id ON financial_audit_logs(payment_id);

CREATE INDEX IF NOT EXISTS idx_grade_audit_user_id ON grade_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_grade_audit_timestamp ON grade_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_grade_audit_student_id ON grade_audit_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_grade_audit_grade_id ON grade_audit_logs(grade_id);

-- Comments for documentation
COMMENT ON TABLE audit_logs IS 'RN05: Main audit log table tracking all critical system operations';
COMMENT ON TABLE financial_audit_logs IS 'RN05: Specialized audit trail for all financial operations';
COMMENT ON TABLE grade_audit_logs IS 'RN05: Track all modifications to student grades for academic integrity';

-- Sample queries for audit reports

-- View recent audit activity
-- SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100;

-- View failed authentication attempts
-- SELECT * FROM auth_logs WHERE status = 'falha' ORDER BY data_hora DESC;

-- View all grade changes by a specific teacher
-- SELECT * FROM grade_audit_logs WHERE user_id = ? ORDER BY timestamp DESC;

-- View financial operations by date range
-- SELECT * FROM financial_audit_logs 
-- WHERE timestamp BETWEEN '2024-01-01' AND '2024-12-31'
-- ORDER BY timestamp DESC;

-- View unauthorized access attempts
-- SELECT * FROM audit_logs WHERE status_code = 403 ORDER BY timestamp DESC;
