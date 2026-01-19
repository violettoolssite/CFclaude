/**
 * Workflow Agent - Background task execution
 * Inspired by Continue's headless mode
 */

import { EventEmitter } from 'events';
import chalk from 'chalk';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  action: () => Promise<any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: Error;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export class WorkflowAgent extends EventEmitter {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private running: boolean = false;

  constructor() {
    super();
  }

  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
  }

  async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    this.running = true;
    this.emit('workflow:start', workflow);

    for (const step of workflow.steps) {
      if (!this.running) break;

      step.status = 'running';
      this.emit('step:start', step);

      try {
        step.result = await step.action();
        step.status = 'completed';
        this.emit('step:complete', step);
      } catch (error) {
        step.status = 'failed';
        step.error = error as Error;
        this.emit('step:error', step);
        
        // Stop workflow on error
        this.running = false;
        this.emit('workflow:error', workflow, error);
        return;
      }
    }

    this.running = false;
    this.emit('workflow:complete', workflow);
  }

  stop(): void {
    this.running = false;
    this.emit('workflow:stopped');
  }

  isRunning(): boolean {
    return this.running;
  }
}

// Pre-defined workflows
export function createCodeReviewWorkflow(files: string[]): WorkflowDefinition {
  return {
    id: 'code-review',
    name: 'Code Review',
    steps: files.map((file, index) => ({
      id: `review-${index}`,
      name: `Review ${file}`,
      description: `Analyzing ${file} for code quality and potential issues`,
      action: async () => {
        // Placeholder for actual review logic
        await new Promise(resolve => setTimeout(resolve, 100));
        return { file, reviewed: true };
      },
      status: 'pending' as const
    }))
  };
}

export function createRefactorWorkflow(target: string): WorkflowDefinition {
  return {
    id: 'refactor',
    name: 'Refactor Code',
    steps: [
      {
        id: 'analyze',
        name: 'Analyze Code',
        description: 'Analyzing code structure and dependencies',
        action: async () => ({ analyzed: true }),
        status: 'pending'
      },
      {
        id: 'plan',
        name: 'Create Refactoring Plan',
        description: 'Planning refactoring steps',
        action: async () => ({ planned: true }),
        status: 'pending'
      },
      {
        id: 'execute',
        name: 'Execute Refactoring',
        description: 'Applying refactoring changes',
        action: async () => ({ executed: true }),
        status: 'pending'
      },
      {
        id: 'verify',
        name: 'Verify Changes',
        description: 'Verifying refactored code',
        action: async () => ({ verified: true }),
        status: 'pending'
      }
    ]
  };
}

export function printWorkflowProgress(workflow: WorkflowDefinition): void {
  console.log(chalk.cyan(`\nWorkflow: ${workflow.name}`));
  console.log(chalk.gray('─'.repeat(40)));
  
  workflow.steps.forEach((step, index) => {
    let statusIcon = '○';
    let statusColor = chalk.gray;
    
    switch (step.status) {
      case 'running':
        statusIcon = '◐';
        statusColor = chalk.yellow;
        break;
      case 'completed':
        statusIcon = '●';
        statusColor = chalk.green;
        break;
      case 'failed':
        statusIcon = '✕';
        statusColor = chalk.red;
        break;
    }
    
    console.log(statusColor(`${statusIcon} ${index + 1}. ${step.name}`));
    if (step.status === 'running') {
      console.log(chalk.gray(`   ${step.description}`));
    }
  });
}

